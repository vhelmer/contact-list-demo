<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource(attributes: [
    'normalization_context' => ['groups' => ['read']],
    'denormalization_context' => ['groups' => ['write']],
])]
class Contact
{
    #[Groups(["read", "write"])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    #[ApiProperty(identifier: false)]
    private ?int $id = null;

    #[Groups(["read", "write"])]
    #[Assert\NotBlank]
    #[ORM\Column(type: Types::STRING)]
    public string $firstName;

    #[Groups(["read", "write"])]
    #[Assert\NotBlank]
    #[ORM\Column(type: Types::STRING)]
    public string $lastName;

    #[Groups(["read", "write"])]
    #[Assert\Email]
    #[ORM\Column(type: Types::STRING, nullable: true)]
    public ?string $email;

    #[Groups(["read", "write"])]
    #[ORM\Column(type: Types::STRING, nullable: true)]
    public ?string $phoneNumber;

    #[Groups(["read", "write"])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    public ?string $note;

    #[Groups(["read"])]
    #[ORM\Column(type: Types::STRING, unique: true)]
    #[ApiProperty(identifier: true)]
    public string $slug;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): void
    {
        $this->slug = $slug;
    }

}
