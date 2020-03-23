# deploying image

you need to pass an API_URL environment variable to the image.

```
  ihm:
    image: datalakecgdd/ihm-alimentation
    environment:
      - API_URL=https://my.api.url/v1/

```
