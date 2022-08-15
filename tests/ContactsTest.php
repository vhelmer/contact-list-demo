<?php

namespace App\Tests;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Contact;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;

class ContactsTest extends ApiTestCase
{

    const SLUG = 'vojtech-hired';

    use RefreshDatabaseTrait;

    public function testGetCollection(): void
    {
        $response = static::createClient()->request('GET', '/api/contacts');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/api/contexts/Contact',
            '@id' => '/api/contacts',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 100,
        ]);

        $this->assertCount(100, $response->toArray()['hydra:member']);
        $this->assertMatchesResourceCollectionJsonSchema(Contact::class);
    }

    public function testCreateContact(): void
    {
        $response = static::createClient()->request('POST', '/api/contacts', ['json' => [
            'firstName' => 'Vojtěch',
            'lastName' => 'Hired',
            'email' => 'you_are@hired.cz',
            'phoneNumber' => '666 777 888',
            'note' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

        ]]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@id' => '/api/contacts/' . self::SLUG,
            '@context' => '/api/contexts/Contact',
            '@type' => 'Contact',
            'firstName' => 'Vojtěch',
            'lastName' => 'Hired',
            'email' => 'you_are@hired.cz',
            'phoneNumber' => '666 777 888',
            'note' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            'slug' => self::SLUG
        ]);
        $this->assertMatchesResourceItemJsonSchema(Contact::class);
    }

    public function testCreateInvalidContact(): void
    {
        static::createClient()->request('POST', '/api/contacts', ['json' => [
            'firstName' => '',
            'lastName' => '',
            'email' => 'invalid',
        ]]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/api/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => "firstName: This value should not be blank.\nlastName: This value should not be blank.\nemail: This value is not a valid email address.",
        ]);
    }

    public function testUpdateContact(): void
    {
        $client = static::createClient();
        /** @var Contact $contact */

        $iri = "/api/contacts/" . self::SLUG;
        $client->request('PUT', $iri, ['json' => [
            'note' => 'updated note',
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'slug' => self::SLUG,
            'note' => 'updated note',
        ]);
    }

    public function testDeleteContact(): void
    {
        $client = static::createClient();
        /** @var Contact $contact */
        $this->assertNotNull($contact);

        $client->request('DELETE', "/api/contacts/" . self::SLUG);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            static::getContainer()->get('doctrine')->getRepository(Contact::class)->findOneBy(['slug' => self::SLUG])
        );
    }

}