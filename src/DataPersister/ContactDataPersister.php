<?php

namespace App\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use App\Entity\Contact;
use App\Repository\ContactRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\String\ByteString;
use Symfony\Component\String\Slugger\SluggerInterface;

class ContactDataPersister implements ContextAwareDataPersisterInterface
{

    public function __construct(
        private EntityManagerInterface $entityManager,
        private SluggerInterface $slugger,
        private ContactRepository $contactRepository){}

    public function supports($data, array $context = []): bool
    {
        return $data instanceof Contact;
    }

    /**
     * @param Contact $data
     * @param array $context
     */
    public function persist($data, array $context = []): void
    {
        $slug = $this->slugger->slug("$data->firstName-$data->lastName")->lower();
        /** @var Contact $contact */
        $contact = $this->contactRepository->findOneBy(['slug' => $slug]);
        if ($contact && $contact->getId() !== $data->getId()) {
            $slug .= "-" . ByteString::fromRandom()->toString();
        }
        $data->setSlug($this->slugger->slug($slug));
        $this->entityManager->persist($data);
        $this->entityManager->flush();
    }

    public function remove($data, array $context = []): void
    {
        $this->entityManager->remove($data);
        $this->entityManager->flush();
    }
}
