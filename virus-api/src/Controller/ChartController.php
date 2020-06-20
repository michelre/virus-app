<?php


namespace App\Controller;


use App\Service\AuthenticationService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ChartController
{
    /**
     * @Route("/data/daily-by-country", methods={"GET"}, name="get_daily_by_country")
     * @param Request $request
     * @param AuthenticationService $authenticationService
     * @return JsonResponse|Response
     */
    public function getDailyByCountry(Request $request, AuthenticationService $authenticationService)
    {
        $authorization = $request->headers->get('Authorization');
        $country = $request->query->get('country');
        $date = $request->query->get('date');
        $token = substr($authorization, 7);
        $payload = $authenticationService->decode($token);
        $response = new Response;
        if (isset($payload['userId'])) {
            $client = new \GuzzleHttp\Client();
            $resp = $client->request(
                'GET',
                'https://covid-19-data.p.rapidapi.com/report/country/code?format=json&date-format=YYYY-MM-DD&date=' . $date . '&code=' . $country, [
                "headers" => [
                    "X-RapidAPI-Host" => $_SERVER['API_HOST'],
                    'X-RapidAPI-Key' => $_SERVER['API_KEY']
                ]
            ]);

            $response->headers->set('Content-Type', 'application/json');
            $response->setContent($resp->getBody()->getContents());
            return $response;
        }
        $response->setStatusCode(401);
        return $response;
    }

    /**
     * @Route("/data/countries", methods={"GET"}, name="get_countries")
     * @param Request $request
     * @param AuthenticationService $authenticationService
     * @return JsonResponse|Response
     */
    public function getCountries(Request $request, AuthenticationService $authenticationService)
    {
        $response = new Response;
        $authorization = $request->headers->get('Authorization');
        $token = substr($authorization, 7);
        if(!$token) {
            $response->setStatusCode(401);
            return $response;
        }
        $payload = $authenticationService->decode($token);
        if (isset($payload['userId'])) {
            $client = new \GuzzleHttp\Client();
            $resp = $client->request(
                'GET',
                'https://covid-19-data.p.rapidapi.com/help/countries?format=json', [
                "headers" => [
                    "X-RapidAPI-Host" => $_SERVER['API_HOST'],
                    'X-RapidAPI-Key' => $_SERVER['API_KEY']
                ]
            ]);

            $response->headers->set('Content-Type', 'application/json');
            $response->setContent($resp->getBody()->getContents());
            return $response;
        }
        $response->setStatusCode(401);
        return $response;
    }

}