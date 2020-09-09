<?php


namespace App\Controller;

use App\Entity\User;
use App\Service\AuthenticationService;
use App\Service\MailService;
use Firebase\JWT\JWT;
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
    public function signup(Request $request,
                           AuthenticationService $authenticationService,
                           MailService $mailService)
    {
        $data = json_decode($request->getContent(), true);
        $user = new User();
        $userManager = $this->getDoctrine()->getManager();
        $userRepository = $userManager->getRepository(User::class);
        /* If the user already exists, return an error */
        $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
        if (isset($existingUser)) {
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
        /* We send an email to the new user about the subscription */
        $link = 'http://' . $_SERVER['HTTP_HOST'] . '/api/users/confirm?token=' . $authenticationService->encode($user->getId());
        $mailService->sendMail($data['email'],
            'Votre inscription est validée',
            "<h1>Bienvenue</h1>
                  <p>Veuillez confirmer votre inscription ici:</p> 
                  <a href='" . $link . "'>" . $link . "</a>");

        return $this->json(['status' => 'OK']);
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
        if (!isset($existingUser) || !$existingUser->getAccountConfirmed()) {
            $response->setStatusCode(401);
            $response->setContent(json_encode(['status' => 'User not exists']));
            return $response;
        }

        /* We need to compare the entered password if it matches */
        if (!password_verify($data['password'], $existingUser->getPassword())) {
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
        if (!$token) {
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

    /**
     * @Route("/users/confirm", name="users_confirm")
     * @param Request $request
     * @param AuthenticationService $authenticationService
     * @return JsonResponse|Response
     */
    public function userConfirm(Request $request, AuthenticationService $authenticationService)
    {
        $response = new Response;
        if ($token = $authenticationService->decode($_GET['token'])) {
            $userManager = $this->getDoctrine()->getManager();
            $userRepository = $userManager->getRepository(User::class);
            /** @var User $user */
            $user = $userRepository->find($token['userId']);
            $user->setAccountConfirmed(true);
            $userManager->flush();
            $response->setContent("<h1>Votre compte est validé</h1>");
            return $response;
        }
        $response->setContent("<h1>Jeton expiré ou invalide</h1>");
        return $response;
    }

    /**
     * @Route("/users/forgot-password", methods={"POST"}, name="users_forgot_password")
     * @param Request $request
     * @param AuthenticationService $authenticationService
     * @param MailService $mailService
     * @return JsonResponse|Response
     */
    public function userForgotPassword(Request $request,
                                       AuthenticationService $authenticationService,
                                       MailService $mailService)
    {
        $data = json_decode($request->getContent(), true);
        $response = new Response;
        $userRepository = $this->getDoctrine()->getManager()->getRepository(User::class);
        $user = $userRepository->findOneBy(['email' => $data['email']]);
        if (!isset($user)) {
            $response->setStatusCode(401);
            return $response;
        }
        $link = $_SERVER['FRONTEND_URL'] . '/password?token=' . $authenticationService->encode($user->getId());
        $mailService->sendMail($data['email'],
            'Réinitialisation de votre mot de passe',
            "<p>Veuillez réinitialiser votre mot de passe en utilisant le lien ci-dessous:</p> 
                  <a href='" . $link . "'>" . $link . "</a>");
        return $response;
    }

    /**
     * @Route("/users/password", methods={"PUT"}, name="users_set_password")
     * @param Request $request
     * @param AuthenticationService $authenticationService
     * @return JsonResponse|Response
     */
    public function changePassword(Request $request, AuthenticationService $authenticationService)
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'];
        $payload = $authenticationService->decode($token);
        $response = new Response;
        if (isset($payload['userId'])) {
            $response->headers->set('Content-Type', 'application/json');
            $userManager = $this->getDoctrine()->getManager();
            $userRepository = $userManager->getRepository(User::class);
            /** @var User $user */
            $user = $userRepository->find($payload['userId']);
            if ($data['newPassword'] !== $data['confirmNewPassword']) {
                $response->setStatusCode(422);
                $response->setContent(json_encode(['status' => 'KO', 'message' => 'confirm password error']));
                return $response;
            }
            $user->setPassword(password_hash($data['newPassword'], PASSWORD_BCRYPT));
            $userManager->persist($user);
            $userManager->flush();
            $response->setStatusCode(200);
            return $response;
        }
        $response->setStatusCode(401);
        return $response;
    }

}
