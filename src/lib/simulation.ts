import { faker } from "@faker-js/faker";

export type User = {
  id: string;
  name: string;
  avatar: string;
  latitude: number;
  longitude: number;
  speed: number;
};

export function generateUsers(
  count = 100,
  center = { lat: -6.2, lng: 106.8 }
): User[] {
  const users: User[] = [];

  const slowSpeedRange = { min: 5, max: 15 };
  const fastSpeedRange = { min: 50, max: 70 };

  for (let i = 0; i < count; i++) {
    const userId = i + 1;
    const isEvenId = userId % 2 === 0;

    const lat = center.lat + (Math.random() - 0.5) * 0.2;
    const lng = center.lng + (Math.random() - 0.5) * 0.2;

    users.push({
      id: String(userId),
      name: faker.person.fullName(),
      avatar: faker.image.avatarGitHub(),
      latitude: lat,
      longitude: lng,
      speed: isEvenId
        ? faker.number.int(fastSpeedRange)
        : faker.number.int(slowSpeedRange),
    });
  }
  return users;
}

export function updateUserPosition(user: User): User {
  const baseMovementFactor = 0.00009;

  const movementDistance = baseMovementFactor * user.speed;

  const latMovement = (Math.random() - 0.5) * movementDistance;
  const lngMovement = (Math.random() - 0.5) * movementDistance;

  const newLat = user.latitude + latMovement;
  const newLng = user.longitude + lngMovement;

  return { ...user, latitude: newLat, longitude: newLng };
}
