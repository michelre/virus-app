<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 */
class User implements \JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $password;

    /**
     * @ORM\Column(type="boolean")
     */
    private $accountConfirmed = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'email' => $this->email
        ];
    }

    /**
     * @param mixed $accountConfirmed
     * @return User
     */
    public function setAccountConfirmed($accountConfirmed)
    {
        $this->accountConfirmed = $accountConfirmed;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAccountConfirmed()
    {
        return $this->accountConfirmed;
    }
}
