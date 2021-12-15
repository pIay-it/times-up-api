const Axios = require("axios");
const { stringify } = require("qs");
const { sendError } = require("../helpers/functions/Error");
const { checkRequestData } = require("../helpers/functions/Express");
const Config = require("../../config");

function getFlickrPhotoURL({ server, id, secret }) {
    return `https://live.staticflickr.com/${server}/${id}_${secret}_m.jpg`;
}

exports.getImagesFromFlickr = async search => {
    const queryString = stringify({
        method: "flickr.photos.search",
        text: search,
        // eslint-disable-next-line camelcase
        per_page: 5,
        // eslint-disable-next-line camelcase
        api_key: Config.APIs.flickr.key,
        sort: "relevance",
        media: "photos",
        format: "json",
        nojsoncallback: true,
    });
    const { data } = await Axios.get(`${Config.APIs.flickr.searchImagesURL}?${queryString}`);
    return data?.photos?.photo?.reduce((acc, photo) => {
        const imageFound = { title: photo.title, URL: getFlickrPhotoURL(photo), source: "flickr" };
        return [...acc, imageFound];
    }, []);
};

exports.getImagesFromWikipedia = async search => {
    const queryString = stringify({ q: search, limit: 5 });
    const { data } = await Axios.get(`${Config.APIs.wikipedia.searchImagesURL}?${queryString}`);
    return data.pages.reduce((acc, page) => {
        if (page?.thumbnail) {
            const imageFound = { title: page.title, URL: `https:${page?.thumbnail.url}`, source: "wikipedia" };
            return [...acc, imageFound];
        }
        return acc;
    }, []);
};

exports.getImages = async(req, res) => {
    try {
        const { query } = checkRequestData(req);
        const wikipediaImages = await this.getImagesFromWikipedia(query.search);
        const flickrImages = await this.getImagesFromFlickr(query.search);
        return res.status(200).json([...flickrImages, ...wikipediaImages]);
    } catch (e) {
        sendError(res, e);
    }
};