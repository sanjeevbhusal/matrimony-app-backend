import { Interest, PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const interests = [
  'travel',
  'sports',
  'reading',
  'music',
  'movies',
  'cooking',
  'art',
  'photography',
  'outdoor',
  'hiking',
  'gaming',
  'fashion',
  'dancing',
  'technology',
  'food',
  'volunteer',
  'pets',
  'yoga',
  'writing',
  'gardening',
];

async function createTestUser() {
  return {
    age: faker.helpers.rangeToNumber({ min: 18, max: 50 }),
    bio: faker.lorem.paragraph({ min: 4, max: 5 }),
    currentAddress: faker.location.streetAddress(),
    currentProfession: faker.person.jobTitle(),
    email: 'bhusalsanjeev23@gmail.com',
    firstName: 'Sanjeev',
    lastName: 'Bhusal',
    highestEducation: faker.helpers.arrayElement(["Bachelor's", "Master's"]),
    interests: faker.helpers.arrayElements(interests, {
      min: 5,
      max: 10,
    }) as Interest[],
    password: await bcrypt.hash('hello world', 10),
  };
}

async function createRandomUser() {
  return {
    age: faker.helpers.rangeToNumber({ min: 18, max: 50 }),
    bio: faker.lorem.paragraph({ min: 4, max: 5 }),
    currentAddress: faker.location.streetAddress(),
    currentProfession: faker.person.jobTitle(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    highestEducation: faker.helpers.arrayElement(["Bachelor's", "Master's"]),
    interests: faker.helpers.arrayElements(interests, {
      min: 5,
      max: 10,
    }) as Interest[],
    password: await bcrypt.hash(faker.internet.password(), 10),
    image: faker.image.avatar(),
  };
}

async function getRandomUsers() {
  const users: any[] = [];

  for (let i = 0; i < 20; i++) {
    const user = await createRandomUser();
    users.push(user);
  }

  return users;
}

async function main() {
  await prisma.user.createMany({
    data: [await createTestUser(), ...(await getRandomUsers())],
  });
}

main();
