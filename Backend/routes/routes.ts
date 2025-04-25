import express from 'express';

// import {PrismaClient} from '../generated//prisma/default.js'
import { PrismaClient } from '@prisma/client';
import type { data } from 'react-router';
const prisma = new PrismaClient()
const router = express.Router();
import { authenticate } from './auth.ts';

type Movie = {
    title: string;
    imageUrl: string;
    genre: string;
    overview: string;
    releaseDate: string;
    rating: string;
    duration: string;
    trailerUrl: string;
    quality: string;
    category: string;
    language: string;
    cast: string;
    country: string;
    productionCompany: string;
}

router.get('/', async(req, res) => {
   
    const movies =await prisma.movie.findMany()

    res.status(200).json(movies);
}
);


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const movie = await prisma.movie.findUnique({
        where: {
            id: Number(id),
        },
    });
    if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
});


router.post('/',authenticate, async (req, res) => {
    const { title,imageUrl,genre,overview,releaseDate,rating,duration,trailerUrl, description, quality,category,language,cast,country,productionCompany } = req.body;


    const erros: Partial<Movie> = {};

    if (!title) erros.title = "Title is required";
    if (!imageUrl) erros.imageUrl = "Image URL is required";
    if (!genre) erros.genre = "Genre is required";
    if (!overview) erros.overview = "Overview is required";
    if (!releaseDate) erros.releaseDate = "Release Date is required";
    if (!rating) erros.rating = "Rating is required";
    if (!duration) erros.duration = "Duration is required";
    if (!trailerUrl) erros.trailerUrl = "Trailer URL is required";
    if (!quality) erros.quality = "Quality is required";
    if (!category) erros.category = "Category is required";
    if (!language) erros.language = "Language is required";
    if (!cast) erros.cast = "Cast is required";
    if (!country) erros.country = "Country is required";
    if (!productionCompany) erros.productionCompany = "Production Company is required";


    if (Object.keys(erros).length > 0) {
        res.status(400).json({ erros });
    }
    const formartedReleaseDate = new Date(releaseDate);

    const movie=await prisma.movie.create({
        data:{
            title,
            imageUrl,
            genre,
            overview,
            releaseDate:formartedReleaseDate,
            rating,
            duration,
            trailerUrl,
            quality,
            category,
            language,
            cast,
            country,
            productionCompany
        }
    })
    res.status(201).json(movie);
    }
);





router.put('/:id',authenticate, async (req, res) => {
    const { id } = req.params;
    const { title,imageUrl,genre,overview,releaseDate,rating,duration,trailerUrl, description, quality,category,language,cast,country,productionCompany } = req.body;
    const erros: Partial<Movie> = {};
    if (!title) erros.title = "Title is required";
    if (!imageUrl) erros.imageUrl = "Image URL is required";
    if (!genre) erros.genre = "Genre is required";
    if (!overview) erros.overview = "Overview is required";
    if (!releaseDate) erros.releaseDate = "Release Date is required";
    if (!rating) erros.rating = "Rating is required";
    if (!duration) erros.duration = "Duration is required";
    if (!trailerUrl) erros.trailerUrl = "Trailer URL is required";
    if (!quality) erros.quality = "Quality is required";
    if (!category) erros.category = "Category is required";
    if (!language) erros.language = "Language is required";
    if (!cast) erros.cast = "Cast is required";
    if (!country) erros.country = "Country is required";
    if (!productionCompany) erros.productionCompany = "Production Company is required";

    if (Object.keys(erros).length > 0) {
        res.status(400).json({ erros });
    }
    const formartedReleaseDate = new Date(releaseDate);
    const movie = await prisma.movie.update({
        where: {
            id: Number(id),
        },
        data: {
            title,
            imageUrl,
            genre,
            overview,
            releaseDate: formartedReleaseDate,
            rating,
            duration,
            trailerUrl,
            quality,
            category,
            language,
            cast,
            country,
            productionCompany
        },
    });
    if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
}
);


router.delete('/:id',authenticate, async (req, res) => {
    const { id } = req.params;
    const movie = await prisma.movie.delete({
        where: {
            id: Number(id),

        },
    });
    if (!movie) {
        res.status(404).json({ message: 'Movie To Delete not found' });
    }
    res.status(200).json(movie);
}
);

export default router;