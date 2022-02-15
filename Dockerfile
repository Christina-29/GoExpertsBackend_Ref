# Set the base images version to node 14.17.0 (LTS)
FROM node:14.17 AS builder

#ENV NODE_ENV=uat

WORKDIR /app
# Above we set the build environment as a folder called /app in the docker container to prevent clashes

COPY package*.json ./
# To prevent repeated npm installs anytime we make any change, we'd copy over the package.json and install things first

RUN npm install
# Install dependencies

#RUN npm run build

COPY ./ ./
# Copy the rest of the project over to the /app folder in the container

# The server listens at PORT 3000
EXPOSE 5000

CMD [ "npm", "run", "dev" ]
