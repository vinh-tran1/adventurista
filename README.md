# Adventurista (F23)
Social Connectivity App For Travel

## Summary
**Adventurista** is a mobile app designed to tackle the challenges of travel coordination, planning, and meeting new people. The platform allows users to post upcoming adventure plans and join other people’s events within their travel location – fostering seamless friendships, expanding their global network, and making memorable travel experiences.

_by **Patrick, Nikhil, Ej, Vinh, and Akshay**_

## Problem

Meeting new people, finding hidden gems, or picking activities can all be tricky when traveling to new places, especially when traveling alone or in small groups. Many people often find themselves going to TripAdvisor and typing in “Top 10 Things to Do In …” only to be met with over-priced tours, tourist-driven sights, and out-dated information. Traditionally, many people hope to find friends when staying in hostels or simply on the street – but we can’t leave everything to chance. This is certainly an issue for frequent travelers looking for ways to quickly find new groups of people with similar interests who want to explore together.

Adventurista hopes to solve all these problems and more: imagine that when you travel, you can see on any given day what events are popular or where everyone your age is going for the night. This social platform is essentially facebook group meets dating app – it connects people through group events. It allows users to seamlessly plan adventures, post their own events as well as browse through other people’s events in the vicinity, join groups and add friends, and organize itineraries.

Adventurista allows users to grow a global network of friends, meet new people, find new places, and plan new adventures.

## Technology Stack
Our mobile app is built using a DERN stack along with Amazon Web Services.

1. DERN Stack
- **Frontend**: React Native, Redux
- **Backend**: Node.js, Express.js, DynamoDB (Database)

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
- 'frontend/Shared/`: Reusable components
- 'frontend/assets/`: images

### Backend
- ~~

## Deployment
### Locally
#### Frontend
- navigate to `frontend/`
- install packages: `npm install`
- run native app: `npm start`
- optional: download Expo Go on mobile to view app on mobile device

#### Backend
- navigate to ~~

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
