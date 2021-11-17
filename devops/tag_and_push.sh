#! /bin/sh
VERSION=$1
IMG_PREFIX="registry.gitlab.com/group/project"

IMAGES="web devops dbmate"
for IMG in $IMAGES; do
  echo $IMG:$VERSION
  docker tag $IMG_PREFIX/$IMG:latest $IMG_PREFIX/$IMG:latest
  docker tag $IMG_PREFIX/$IMG:latest $IMG_PREFIX/$IMG:${VERSION}
  docker push $IMG_PREFIX/$IMG:${VERSION}
  docker push $IMG_PREFIX/$IMG:latest
done
