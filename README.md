<h1 align="center">
  <img src="frontend/assets/white-bg-logo.png" width="400" />
  <br/>
  a social connectivity app
</h1>

<p align="center">
Adventurista (F23) is a mobile app designed to tackle the challenges of travel coordination, planning, and meeting new people. The platform allows users to post upcoming adventure plans and join other people’s events within their travel location – fostering seamless friendships, expanding their global network, and making memorable travel experiences.
</p>

<p align="center">by Patrick, Nikhil, Ej, Vinh, Akshay</p>

## The Problem

Meeting new people, finding hidden gems, or picking activities can all be tricky when traveling to new places, especially when traveling alone or in small groups. Many people often find themselves going to TripAdvisor and typing in “Top 10 Things to Do In …” only to be met with over-priced tours, tourist-driven sights, and out-dated information. Traditionally, many people hope to find friends when staying in hostels or simply on the street – but we can’t leave everything to chance. This is certainly an issue for frequent travelers looking for ways to quickly find new groups of people with similar interests who want to explore together.

Adventurista hopes to solve all these problems and more: imagine that when you travel, you can see on any given day what events are popular or where everyone your age is going for the night. This social platform is essentially facebook group meets dating app – it connects people through group events. It allows users to seamlessly plan adventures, post their own events as well as browse through other people’s events in the vicinity, join groups and add friends, and organize itineraries.

Adventurista allows users to grow a global network of friends, meet new people, find new places, and plan new adventures.

## Technology Stack

Our mobile app is built using a DERN stack along with Amazon Web Services.

1. DERN Stack
- **Frontend**: React Native, Redux
- **Backend**: Node.js, Express.js, DynamoDB

Using React Native, our app is able to run on both iOS and Android.

2. AWS
- **ECS + Fargate** for compute. We will run a containerized Node.js server(s) with Express to process the API calls
- **DynamoDB** for persistent data storage. We will have different tables for users, events, friends, etc.
- **S3** for storing images
- **API Gateway** for the public endpoint and routing API calls to the Node.js server(s)

## Code Structure

### Frontend
- `frontend/Navigators/`: React Native stack navigation for major screens
- `frontend/Redux/`: Redux for global state
- `frontend/Screens/`: Folders for the major screens
- `frontend/Shared/`: Reusable components
- `frontend/assets/`: Images

### Backend
- `backend/bin/`: Where CDK stacks are initialized. Currently, we only have 1 ("CDKStack") with all of our resources within it. When we switch back to CodePipeline, we will have 2+ stacks
- `backend/cdk.out/`: Output of CDK code as `.yaml` files for CloudFormation to consume. Normally git-ignored, but pushed for CI tests to pass.
- `backend/lib/`: Where CDK stacks are defined. Our current stack ("CDKStack") contains our API Gateway, Fargate, S3, and DynamoDB instances. Specifications, access controls, and settings are defined here.
- `backend/src/`: The containerized (Docker) Node.js/Express server that runs on Fargate
- `backend/test/`: Where unit tests are stored

## Deployment

### Locally

#### Frontend
- To run React Native app using Expo, run:
```bash
# navigate to frontend
$ cd frontend
# install dependencies
$ npm install
# run app
$ npm start
```
Optional: download Expo Go on mobile to view app on mobile device

#### Backend

- To run the Node.js/Express server directly on your local machine (port 80), run:
```bash
# navigate to backend/src/
cd backend/src
npm install
npm run start
```
- To run the Node.js/Express server as a Docker container on your local machine, run:
```bash
# navigate to backend/src/
cd backend/src
docker build . -t ts-adventurista
docker run -p 80:80 --name adventurista ts-adventurista
```
- Note that any local deployment of the backend will not function fully, as DynamoDB + S3 instances cannot be connected to. This deployment simply replicates what will be run on an instance within Fargate

### Production

#### Frontend
- ~~

#### Backend (AWS)
- Configure the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) (`aws configure`) with your AWS account
- Install the [AWS CDK Toolkit](https://docs.aws.amazon.com/cdk/v2/guide/cli.html)
- Navigate to `backend/`
- Bootstrap your (new) AWS account with `cdk bootstrap {aws-account-id}/{region}`
- Deploy code to your AWS account with `cdk deploy`

## Testing

### Frontend (~~)
- ~~
  	- Coverage: ~~%
- ~~
  	- Coverage: ~~%
- ~~
  	- Coverage: ~~%
  	  
### Backend (Jest)
- CDK Unit Tests (Checks if AWS resources have been written to cdk.out. Cdk.out is what is consumed by AWS CloudFormation when we use `cdk deploy`)
	- Coverage: 100%
- Events Unit Tests
	- Coverage: ~~%
- Users Unit Tests
	- Coverage: ~~%
- Messages Unit Tests
	- Coverage: ~~%
