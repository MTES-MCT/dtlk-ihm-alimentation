# building image

```
REGISTRY=my.registry.com make build
REGISTRY=my.registry.com make push
```
You can also check for vulnerability with
```
make audit
```

# deploying image

you need to pass an API_URL variable to the image.

```
  ihm:
    image: datalake/ihm/alimentation
    environment:
      - API_URL=https://my.api.url/v1/

```
