const { db } = require('@vercel/postgres');
const {
  regions,
  lines,
  regionLines,
  persons,
  personRegions,
  quotes,
} = require('../app/lib/data');

async function createTable(client) {
  try {
    // UUID and PostGIS Extensions
    // await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`CREATE EXTENSION IF NOT EXISTS postgis`;

    // language table
    await client.sql`
    CREATE TABLE IF NOT EXISTS language (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL
    );
    `;
    console.log('create language table success');

    // race table
    await client.sql`
    CREATE TABLE IF NOT EXISTS race (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL
    );
    `;
    console.log('create race table success');

    // Race-Language table
    await client.sql`
    CREATE TABLE IF NOT EXISTS race_language (
      race_id INTEGER NOT NULL REFERENCES race(id),
      language_id INTEGER NOT NULL REFERENCES language(id)
    );
    `;
    console.log('create race_language table success');

    // Family table
    await client.sql`
    CREATE TABLE IF NOT EXISTS family (
      id SERIAL PRIMARY KEY,
      race_id INTEGER REFERENCES race(id),
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL
    );
    `;
    console.log('create family table success');
    
    // image table
    await client.sql`
    CREATE TABLE IF NOT EXISTS image (
      id SERIAL PRIMARY KEY,
      url VARCHAR(255) NOT NULL
    );
    `;
    console.log('create image table success');

    // region table
    await client.sql`
    CREATE TABLE IF NOT EXISTS region (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      brief_description TEXT NOT NULL,
      history TEXT NOT NULL,
      geography TEXT NOT NULL,
      role_in_story TEXT NOT NULL,
      depiction_in_media TEXT NOT NULL
    );
    `;
    console.log('create region table success');

    // region_image table
    await client.sql`
    CREATE TABLE IF NOT EXISTS region_image (
      region_id INTEGER NOT NULL REFERENCES region(id),
      image_id INTEGER NOT NULL REFERENCES image(id)
    );
    `;
    console.log('create region_image table success');

    // Line table
    await client.sql`
    CREATE TABLE IF NOT EXISTS line (
      id SERIAL PRIMARY KEY,
      start_point GEOMETRY(Point, 4326),
      end_point GEOMETRY(Point, 4326)
    );
    `;
    console.log('create line table success');

    // Region-Line table
    await client.sql`
    CREATE TABLE IF NOT EXISTS region_line (
      region_id INTEGER NOT NULL REFERENCES region(id),
      line_id INTEGER NOT NULL REFERENCES line(id)
    );
    `;
    console.log('create region_line table success');

    // Create spatial index on Line table
    await client.sql`CREATE INDEX line_gix ON line USING GIST (start_point, end_point)`;
    console.log('create spatial index success');

    // Person table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      race_id INTEGER NOT NULL REFERENCES race(id),
      birth_date VARCHAR(255),
      death_date VARCHAR(255),
      nickname VARCHAR(255),
      gender CHAR(1),
      history TEXT NOT NULL,
      crrs TEXT NOT NULL,
      abilities_characteristics TEXT NOT NULL,
      brief_description TEXT NOT NULL,
      home INTEGER REFERENCES region(id)
    );
    `;
    console.log('create person table success');

    // Person-Region table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person_region (
      person_id INTEGER NOT NULL REFERENCES person(id),
      region_id INTEGER NOT NULL REFERENCES region(id)
    );
    `;
    console.log('create person_region table success');

    // Tree table
    await client.sql`
    CREATE TABLE IF NOT EXISTS tree (
      parent_id INTEGER NOT NULL REFERENCES person(id),
      spring_id INTEGER NOT NULL REFERENCES person(id)
    );
    `;
    console.log('create tree table success');

    // person_family table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person_family (
      person_id INTEGER NOT NULL REFERENCES person(id),
      family_id INTEGER NOT NULL REFERENCES person(id)
    );
    `;
    console.log('create person_family table success');

    // person_image table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person_image (
      person_id INTEGER NOT NULL REFERENCES person(id),
      image_id INTEGER NOT NULL REFERENCES image(id)
    );
    `;
    console.log('create person_image table success');
    
    // quote table
    await client.sql`
    CREATE TABLE quote (
      id SERIAL PRIMARY KEY,
      saying VARCHAR(255) NOT NULL,
      person_id INTEGER REFERENCES person(id),
      region_id INTEGER REFERENCES region(id),
      CHECK (
        (person_id IS NOT NULL AND region_id IS NOT NULL) OR 
        (person_id IS NOT NULL AND region_id IS NULL) OR 
        (region_id IS NOT NULL AND person_id IS NULL)
      )
    );
    `;
    console.log('create quote table success');

    // Event table
    await client.sql`
    CREATE TABLE IF NOT EXISTS event (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      detailed_description TEXT NOT NULL,
      brief_description TEXT NOT NULL
    );
    `;
    console.log('create event table success');

    // Item table
    await client.sql`
    CREATE TABLE IF NOT EXISTS item (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL
    );
    `;
    console.log('create item table success');

    // event_image table
    await client.sql`
    CREATE TABLE IF NOT EXISTS event_image (
      event_id INTEGER NOT NULL REFERENCES event(id),
      image_id INTEGER NOT NULL REFERENCES image(id)
    );
    `;
    console.log('create event_image table success');

    // item_image table
    await client.sql`
    CREATE TABLE IF NOT EXISTS item_image (
      item_id INTEGER NOT NULL REFERENCES item(id),
      image_id INTEGER NOT NULL REFERENCES image(id)
    );
    `;
    console.log('create item_image table success');

    // Person-Event table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person_event (
      person_id INTEGER NOT NULL REFERENCES person(id),
      event_id INTEGER NOT NULL REFERENCES event(id)
    );
    `;
    console.log('create person_event table success');

    // Person-Item table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person_item (
      person_id INTEGER NOT NULL REFERENCES person(id),
      item_id INTEGER NOT NULL REFERENCES item(id)
    );
    `;
    console.log('create person_item table success');

    // region_event table
    await client.sql`
    CREATE TABLE IF NOT EXISTS region_event (
      event_id INTEGER NOT NULL REFERENCES event(id),
      region_id INTEGER NOT NULL REFERENCES region(id)
    );
    `;
    console.log('create region_event table success');

    // Event-Item table
    await client.sql`
    CREATE TABLE IF NOT EXISTS event_item (
      event_id INTEGER NOT NULL REFERENCES event(id),
      item_id INTEGER NOT NULL REFERENCES item(id)
    );`;
    console.log('create event_item table success')

  } catch (error) {
    console.log(error);
    throw new Error('error occurred while creating tables');
  }
};

// async function seedLanguage(client) {
//   try {
//     const insertedLanguage = await Promise.all(
//       languages.map(
//         (language) => client.sql`
//         INSERT INTO language (name, description)
//         VALUES (${language.name}, ${language.description});
//         `
//       ),
//     );

//     return {
//       languages: insertedLanguage
//     };
//   } catch (error) {
//     console.log("Error while inserting languages data:", error);
//     throw error;
//   }
// };

// async function seedRace(client) {
//   try {
//     const insertedRaces = await Promise.all(
//       races.map(
//         (race) => client.sql`
//         INSERT INTO race (name, description)
//         VALUES (${race.name}, ${race.description});
//         `
//       ),
//     );

//     return {
//       races: insertedRaces,
//     }
//   } catch (error) {
//     console.log("Error while inserting races data:", error);
//     throw error;
//   }
// };

// async function seedRaceLanguage(client) {
//   try {
//     const insertedRaceLanguages = await Promise.all(
//       raceLanguages.map(
//         (raceLanguage) => client.sql`
//         INSERT INTO race_language (race_id, language_id)
//         VALUES (${raceLanguage.race_id}, ${raceLanguage.language_id});
//         `
//       ),
//     );

//     return {
//       raceLanguages: insertedRaceLanguages,
//     }
//   } catch (error) {
//     console.log("Error while inserting race_language data:", error);
//     throw error;
//   }
// };

// async function seedFamily(client) {
//   try {
//     const insertedFamilies = await Promise.all(
//       families.map(
//         (family) => client.sql`
//         INSERT INTO family (race_id, name, description)
//         VALUES (${family.race_id}, ${family.name}, ${family.description});
//         `
//       ),
//     );

//     return {
//       familis: insertedFamilies,
//     }
//   } catch (error) {
//     console.log("Error while inserting family data:", error);
//     throw error;
//   }
// };

async function seedRegion(client) {
  try {
    const insertedRegions = await Promise.all(
      regions.map(
        (region) => client.sql`
        INSERT INTO region (name, brief_description, history, geography, role_in_story, depiction_in_media)
        VALUES(${region.name}, ${region.brief_description}, ${region.history}, ${region.geography}, ${region.role_in_story}, ${region.depiction_in_media});
        `
      )
    );

    return {
      regions: insertedRegions,
    }
  } catch (error) {
    console.log("Error while inserting region data:", error);
    throw error;
  }
};

async function seedLine(client) {
  try {
    const insertedLines = await Promise.all(
      lines.map(
        (line) => client.sql`
        INSERT INTO line (start_point, end_point)
        VALUES (
          ST_MakePoint(${line.start_point[0]}, ${line.start_point[1]}),
          ST_MakePoint(${line.end_point[0]}, ${line.end_point[1]})
        );
        `
      )
    );

    return {
      lines: insertedLines,
    }
  } catch (error) {
    console.log("Error while inserting line data:", error);
    throw error;
  }
};

async function seedRegionLine(client) {
  try {
    const insertedRegionLines = await Promise.all(
      regionLines.map(
        (regionLine) => client.sql`
        INSERT INTO region_line (region_id, line_id)
        VALUES (${regionLine.region_id}, ${regionLine.line_id});
        `
      )
    );

    return {
      regionLines: insertedRegionLines,
    }
  } catch (error) {
    console.log("Error while inserting region_line data:", error);
    throw error;
  }
};

async function seedPerson(client) {
  try {
    const insertedPerson = await Promise.all(
      persons.map(
        (person) => client.sql`
        INSERT INTO person (name, race_id, birth_date, death_date, nickname, gender, history, crrs, abilities_characteristics, brief_description, home)
        VALUES (${person.name}, ${person.race_id}, ${person.birth_date}, ${person.death_date}, ${person.nickname}, ${person.gender}, ${person.history}, ${person.crrs}, ${person.abilities_characteristics}, ${person.brief_description}, ${person.home});
        `
      )
    );

    return {
      persons: insertedPerson,
    }
  } catch (error) {
    console.log("Error while inserting person data:", error);
    throw error;
  }
};

async function seedPersonRegion(client) {
  try {
    const insertedPersonRegions = await Promise.all(
      personRegions.map(
        (personRegion) => client.sql`
        INSERT INTO person_region (person_id, region_id)
        VALUES (${personRegion.person_id}, ${personRegion.region_id});
        `
      )
    );

    return {
      personRegions: insertedPersonRegions,
    }
  } catch (error) {
    console.log("Error while inserting person_region data:", error);
    throw error;
  }
};

async function seedQuote(client) {
  try {
    const instertedQuotes = await Promise.all(
      quotes.map(
        (quote) => client.sql`
        INSERT INTO quote (saying, person_id, region_id)
        VALUES (${quote.saying}, ${quote.person_id}, ${quote.region_id});
        `
      ),
    );

    return {
      quotes: instertedQuotes,
    }
  } catch (error) {
    console.log("Error while inserting quotes data:", error);
    throw error;
  }
};

async function main() {
  const client = await db.connect();

  // await createTable(client);

  // await seedRegion(client);
  await seedLine(client);
  await seedRegionLine(client);
  // await seedPerson(client);
  // await seedPersonRegion(client);
  // await seedQuote(client);

  await client.end();
};


main().catch((err) => {
  console.log(
    "An error occurred:",
    err,
  );
});