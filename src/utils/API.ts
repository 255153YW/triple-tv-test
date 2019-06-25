import axios from "axios";
import tmdbKey from 'tmdbKey.json';

const API = axios.create({
    baseURL: "https://api.themoviedb.org/",
    responseType: "json"
  });

const ImageBaseUrl = "https://image.tmdb.org/t/p"

export {tmdbKey, API, ImageBaseUrl};