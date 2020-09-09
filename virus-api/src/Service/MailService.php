<?php


namespace App\Service;


use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Mailjet\Client;
use Mailjet\Resources;

class MailService
{
    private $mj;

    public function __construct()
    {
        $this->mj = new Client($_SERVER['MAILJET_KEY'], $_SERVER['MAILJET_SECRET'],true, ['version' => 'v3.1']);
    }

    public function sendMail($to, $subject, $text)
    {
        $senderMail = $_SERVER['SENDER_MAIL'];
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "$senderMail"
                    ],
                    'To' => [
                        [
                            'Email' => "$to",
                        ]
                    ],
                    'Subject' => "$subject",
                    'HTMLPart' => "$text"
                ]
            ]
        ];

        $response = $this->mj->post(Resources::$Email, ['body' => $body]);

        //Returns a boolean if everything was fine or not
        return $response->success();
    }

}
