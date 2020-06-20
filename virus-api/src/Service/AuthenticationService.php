<?php


namespace App\Service;


use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;

class AuthenticationService
{
    private $key;

    public function __construct()
    {
        $this->key = $_SERVER['JWT_KEY'];
    }

    public function encode($userId){
        $payload = array(
            "sub" => "virusapi",
            "userId" => $userId,
            "exp" => time() + 3600
        );
        return JWT::encode($payload, $this->key);
    }

    public function decode($jwt){
        try {
            return (array)JWT::decode($jwt, $this->key, ['HS256']);
        } catch (ExpiredException $e){
            return false;
        }

    }

    /**
     * IMPORTANT:
     * You must specify supported algorithms for your application. See
     * https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40
     * for a list of spec-compliant algorithms.
     */
/*$jwt = JWT::encode($payload, $key);
$decoded = JWT::decode($jwt, $key, array('HS256'));

print_r($decoded);*/

}