<?php


namespace App\Controller;


use App\Service\AuthenticationService;
use GuzzleHttp\Client;
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
            $client = new Client();
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
            $client = new Client();
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

    /**
     * @Route("/data/latest-all-countries", methods={"GET"}, name="get_latest_all_countries")
     * @param Request $request
     * @param AuthenticationService $authenticationService
     * @return JsonResponse|Response
     */
    public function getLatestAllCountries(Request $request, AuthenticationService $authenticationService)
    {
        $authorization = $request->headers->get('Authorization');
        $token = substr($authorization, 7);
        $type = $request->query->get('type') ?? 'deaths';
        $payload = $authenticationService->decode($token);
        $response = new Response;
        if (isset($payload['userId'])) {
            $client = new Client();
            /* Need another plan to fetch all countries with just one request.
            Instead we make two requests:
               The first one to fetch all countries, and another one to fetch latest data foreach country
            */
            $resp = $client->request(
                'GET',
                'https://covid-19-data.p.rapidapi.com/help/countries', [
                "headers" => [
                    "X-RapidAPI-Host" => $_SERVER['API_HOST'],
                    'X-RapidAPI-Key' => $_SERVER['API_KEY']
                ]
            ]);

            $countries = json_decode($resp->getBody()->getContents(), true);
            $i = 0;
            $data = [];
            foreach ($countries as $country){
                sleep(2.5);
                // Prevent overwhelm the API with api calls
                if($i > 2){
                    break;
                }
                $resp = $client->request(
                    'GET',
                    "https://covid-19-data.p.rapidapi.com/country/code?code=" . $country['alpha2code'], [
                    "headers" => [
                        "X-RapidAPI-Host" => $_SERVER['API_HOST'],
                        'X-RapidAPI-Key' => $_SERVER['API_KEY']
                    ]
                ]);
                $latest = json_decode($resp->getBody()->getContents(), true);
                if(!isset($data[$country['alpha2code']])) {
                    $data[$country['alpha2code']] = ['country' => $country['name'], 'value' => 0];
                }
                foreach ($latest as $value){
                    $element = $value[$type] ?? 0;
                    $v = $data[$country['alpha2code']]['value'] + $element;
                    $data[$country['alpha2code']]['value'] = $v;
                }
                $i++;
            }

            /**
             * Sort by values
             */
            $dataValues = array_values($data);
            usort($dataValues, function ($item1, $item2) {
                return $item2['value'] <=> $item1['value'];
            });

            $response->headers->set('Content-Type', 'application/json');
            $response->setContent(json_encode($dataValues));
            return $response;
        }
        $response->setStatusCode(401);
        return $response;
    }

}
