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

    // page table
    await client.sql`
    CREATE TABLE IF NOT EXISTS page (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      counter INT DEFAULT 0
    );
    `;
    console.log('create page table success');

    // text table
    await client.sql`
    CREATE TABLE IF NOT EXISTS text (
      page_id INTEGER NOT NULL REFERENCES page(id),
      text TEXT NOT NULL,
      h_one INT DEFAULT 0
    );
    `;
    console.log('create text table success');
    
    // page-image table
    await client.sql`
    CREATE TABLE IF NOT EXISTS page_image (
      page_id INTEGER NOT NULL REFERENCES page(id),
      url TEXT NOT NULL
    );
    `;
    console.log('create page_image table success');

    // map table
    await client.sql`
    CREATE TABLE iF NOT EXISTS map (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image_url TEXT NOT NULL
    );
    `;
    console.log('create map table success');

    // region table
    await client.sql`
    CREATE TABLE IF NOT EXISTS region (
      id SERIAL PRIMARY KEY,
      page_id INTEGER NOT NULL REFERENCES page(id),
      map_id INTEGER NOT NULL REFERENCES map(id),
      brief_description TEXT NOT NULL
    );
    `;
    console.log('create region table success');

    // line table
    await client.sql`
    CREATE TABLE IF NOT EXISTS line (
      id SERIAL PRIMARY KEY,
      region_id INTEGER NOT NULL REFERENCES region(id),
      start_point GEOMETRY(Point, 4326),
      end_point GEOMETRY(Point, 4326)
    );
    `;
    console.log('create line table success');

    // Create spatial index on Line table
    await client.sql`CREATE INDEX line_gix ON line USING GIST (start_point, end_point)`;
    console.log('create spatial index success');

    // Character Table
    await client.sql`
    CREATE TABLE IF NOT EXISTS character (
      id SERIAL PRIMARY KEY,
      page_id INTEGER NOT NULL REFERENCES page(id),
      birth_date VARCHAR(255) NOT NULL,
      death_date VARCHAR(255) NOT NULL,
      home INTEGER NOT NULL REFERENCES region(id)
    );
    `;
    console.log('create character table success');
    
    // Nickname Table
    await client.sql`
    CREATE TABLE IF NOT EXISTS nickname (
      character_id INTEGER NOT NULL REFERENCES character(id),
      nickname VARCHAR(255) NOT NULL
    );
    `;
    console.log('create nickname table success');

    // Tree Table
    await client.sql`
    CREATE TABLE IF NOT EXISTS tree (
      id SERIAL PRIMARY KEY,
      parent INTEGER NOT NULL REFERENCES character(id),
      child INTEGER NOT NULL REFERENCES character(id)
    );
    `;
    console.log('create tree table success');

    // language table
    await client.sql`
    CREATE TABLE IF NOT EXISTS language (
      id SERIAL PRIMARY KEY,
      page_id INTEGER NOT NULL REFERENCES page(id)
    );
    `;
    console.log('create language table success');

    // race table
    await client.sql`
    CREATE TABLE IF NOT EXISTS race (
      id SERIAL PRIMARY KEY,
      page_id INTEGER NOT NULL REFERENCES page(id)
    );
    `;
    console.log('create race table success');

    // Family table
    await client.sql`
    CREATE TABLE IF NOT EXISTS family (
      id SERIAL PRIMARY KEY,
      page_id INTEGER NOT NULL REFERENCES page(id),
      race_id INTEGER REFERENCES race(id)
    );
    `;
    console.log('create family table success');

    // Event table
    await client.sql`
    CREATE TABLE IF NOT EXISTS event (
      id SERIAL PRIMARY KEY,
      page_id INTEGER NOT NULL REFERENCES page(id)
    );
    `;
    console.log('create event table success');

    // Item table
    await client.sql`
    CREATE TABLE IF NOT EXISTS item (
      id SERIAL PRIMARY KEY,
      page_id INTEGER NOT NULL REFERENCES page(id)
    );
    `;
    console.log('create item table success');

    // Others table
    await client.sql`
    CREATE TABLE IF NOT EXISTS others (
      id SERIAL PRIMARY KEY,
      page_id INTEGER NOT NULL REFERENCES page(id)
    );
    `;
    console.log('create others table success');

    // Character-Region table
    await client.sql`
    CREATE TABLE IF NOT EXISTS character_region (
      character_id INTEGER NOT NULL REFERENCES character(id),
      region_id INTEGER NOT NULL REFERENCES region(id)
    );
    `;
    console.log('create character_region table success');

    // region_event table
    await client.sql`
    CREATE TABLE IF NOT EXISTS region_event (
      event_id INTEGER NOT NULL REFERENCES event(id),
      region_id INTEGER NOT NULL REFERENCES region(id)
    );
    `;
    console.log('create region_event table success');

    // Character-Event table
    await client.sql`
    CREATE TABLE IF NOT EXISTS character_event (
      character_id INTEGER NOT NULL REFERENCES character(id),
      event_id INTEGER NOT NULL REFERENCES event(id)
    );
    `;
    console.log('create character_event table success');

    // // Quote Table
    // await client.sql`
    // CREATE TABLE IF NOT EXISTS quote (
    //   id SERIAL PRIMARY KEY,
    //   quote VARCHAR(255) NOT NULL
    // );
    // `;
    // console.log('create quote table success');
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
  console.log(personRegions);
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

  await createTable(client);

  // await seedRegion(client);
  // await seedLine(client);
  // await seedRegionLine(client);
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