<?php


namespace App\Controller;
use App\Entity\User;
use App\Service\AuthenticationService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UserController extends AbstractController
{
    /**
     * @Route("/users/signup", methods={"POST"}, name="users_signup")
     * @param Request $request
     * @param AuthenticationService $authenticationService
     * @return JsonResponse|Response
     */
    public function signup(Request $request, AuthenticationService $authenticationService)
    {
        $data = json_decode($request->getContent(), true);
        $user = new User();
        $userManager = $this->getDoctrine()->getManager();
        $userRepository = $userManager->getRepository(User::class);

        /* If the user already exists, return an error */
        $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
        if(isset($existingUser)) {
            $resp = new Response();
            $resp->headers->set('Content-Type', 'application/json');
            $resp->setStatusCode(422);
            $resp->setContent(json_encode(['status' => 'KO']));
            return $resp;
        }

        $user->setEmail($data['email']);
        $user->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));
        $userManager->persist($user);
        $userManager->flush();
        $token = $authenticationService->encode($user->getId());
        /* We can authenticate the user with a JWT Token */
        return $this->json(['status' => 'OK', "token" => $token]);
    }

    /**
     * @Route("/users/signin", methods={"POST"}, name="users_signin")
     * @param Request $request
     * @param AuthenticationService $authenticationService
     * @return JsonResponse|Response
     */
    public function signin(Request $request, AuthenticationService $authenticationService)
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $data = json_decode($request->getContent(), true);
        $userManager = $this->getDoctrine()->getManager();
        $userRepository = $userManager->getRepository(User::class);

        /* If the user does not exist, return an authentication error */
        /** @var User $existingUser */
        $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
        if(!isset($existingUser)) {
            $response->setStatusCode(401);
            $response->setContent(json_encode(['status' => 'User not exists']));
            return $response;
        }

        /* We need to compare the entered password if it matches */
        if(!password_verify($data['password'], $existingUser->getPassword())){
            $response->setStatusCode(401);
            $response->setContent(json_encode(['status' => 'Password error']));
            return $response;
        }
        $token = $authenticationService->encode($existingUser->getId());

        /* We can authenticate the user with a JWT Token */
        return $this->json(['status' => 'OK', "token" => $token]);
    }

    /**
     * @Route("/users/me", methods={"GET"}, name="get_me")
     * @param Request $request
     * @param AuthenticationService $authenticationService
     * @return JsonResponse|Response
     */
    public function getMe(Request $request, AuthenticationService $authenticationService)
    {
        $response = new Response;
        $authorization = $request->headers->get('Authorization');
        $token = substr($authorization, 7);
        if(!$token) {
            $response->setStatusCode(401);
            return $response;
        }
        $payload = $authenticationService->decode($token);
        $userRepository = $this->getDoctrine()->getRepository(User::class);
        if (isset($payload['userId'])) {
            $user = $userRepository->find($payload['userId']);
            $response->headers->set('Content-Type', 'application/json');
            $response->setContent(json_encode($user));
            return $response;
        }
        $response->setStatusCode(401);
        return $response;
    }

}