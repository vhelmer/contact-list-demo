<?php

namespace App\Provider;

use Faker\Generator;
use Faker\Provider\Base as BaseProvider;
use Symfony\Component\String\Slugger\SluggerInterface;

final class SlugProvider extends BaseProvider
{

    public function __construct(Generator $generator, private SluggerInterface $slugger)
    {
        parent::__construct($generator);
    }

    public function webalize($slug): string
    {
        return $this->slugger->slug($slug)->lower();
    }
}