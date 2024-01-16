const { db } = require('@vercel/postgres');

async function createTable(client) {
  try {
    // UUID and PostGIS Extensions
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`CREATE EXTENSION IF NOT EXISTS postgis`;

    // language table
    await client.sql`
    CREATE TABLE IF NOT EXISTS language (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL
      description TEXT NOT NULL
    );
    `;
    console.log('create language table success');

    // race table
    await client.sql`
    CREATE TABLE IF NOT EXISTS race (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL
      description TEXT NOT NULL
    );
    `;
    console.log('create race table success');

    // Race-Language table
    await client.sql`
    CREATE TABLE IF NOT EXISTS race_language (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      race_id UUID REFERENCES race(id),
      language_id UUID REFERENCES language(id)
    );
    `;
    console.log('create race_language table success');

    // Family table
    await client.sql`
    CREATE TABLE IF NOT EXISTS family (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      race_id UUID REFERENCES race(id),
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL
    );
    `;
    console.log('create family table success');
    
    // image table
    await client.sql`
    CREATE TABLE IF NOT EXISTS image (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      url VARCHAR(255) NOT NULL,
    );
    `;
    console.log('create image table success');

    // region table
    await client.sql`
    CREATE TABLE IF NOT EXISTS region (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      brief_description VARCHAR(255) NOT NULL,
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
      region_id UUID REFERENCES region(id),
      image_id UUID REFERENCES image(id)
    );
    `;
    console.log('create region_image table success');

    // Line table
    await client.sql`
    CREATE TABLE IF NOT EXISTS line (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      start_point GEOMETRY(Point, 4326),
      end_point GEOMETRY(Point, 4326)
    );
    `;
    console.log('create line table success');

    // Region-Line table
    await client.sql`
    CREATE TABLE IF NOT EXISTS region_line (
      region_id UUID REFERENCES region(id),
      line_id UUID REFERENCES line(id)
    );
    `;
    console.log('create region_line table success');

    // Create spatial index on Line table
    await client.sql`CREATE INDEX line_gix ON line USING GIST (start_point, end_point)`;

    // Person table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      race_id UUID REFERENCES race(id),
      birth_date VARCHAR(255),
      death_date VARCHAR(255),
      nickname VARCHAR(255),
      gender CHAR(1),
      detailed_description TEXT NOT NULL,
      brief_description TEXT NOT NULL,
      image_url VARCHAR(255),
      home UUID REFERENCES region(id)
    );
    `;
    console.log('create person table success');

    // Person-Region table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person_region (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      person_id UUID REFERENCES person(id),
      region_id UUID REFERENCES region(id)
    );
    `;
    console.log('create person_region table success');

    // Tree table
    await client.sql`
    CREATE TABLE IF NOT EXISTS tree (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      parent_id UUID REFERENCES person(id),
      spring_id UUID REFERENCES person(id)
    );
    `;
    console.log('create tree table success');

    // person_family table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person_family (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      person_id UUID REFERENCES person(id),
      family_id UUID REFERENCES person(id),
    );
    `;
    console.log('create person_family table success');

    // person_image table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person_image (
      person_id UUID REFERENCES person(id),
      image_id UUID REFERENCES image(id)
    );
    `;
    console.log('create person_image table success');
    
    // quote table
    await client.sql`
    CREATE TABLE quote (
      id UUID NOT NULL PRIMARY KEY,
      saying VARCHAR(255) NOT NULL,
      person_id UUID REFERENCES person(id),
      region_id UUID REFERENCES region(id),
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
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      detailed_description TEXT,
      brief_description TEXT
    );
    `;
    console.log('create event table success');

    // Item table
    await client.sql`
    CREATE TABLE IF NOT EXISTS item (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      detailed_description TEXT,
      brief_description TEXT,
    );
    `;
    console.log('create item table success');

    // event_image table
    await client.sql`
    CREATE TABLE IF NOT EXISTS event_image (
      event_id UUID REFERENCES event(id),
      image_id UUID REFERENCES image(id)
    );
    `;
    console.log('create event_image table success');

    // item_image table
    await client.sql`
    CREATE TABLE IF NOT EXISTS item_image (
      item_id UUID REFERENCES item(id),
      image_id UUID REFERENCES image(id)
    );
    `;
    console.log('create item_image table success');

    // Person-Event table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person_event (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      person_id UUID REFERENCES person(id),
      event_id UUID REFERENCES event(id)
    );
    `;
    console.log('create person_event table success');

    // Person-Item table
    await client.sql`
    CREATE TABLE IF NOT EXISTS person_item (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      person_id UUID REFERENCES person(id),
      item_id UUID REFERENCES item(id)
    );
    `;
    console.log('create person_item table success');

    // region_event table
    await client.sql`
    CREATE TABLE IF NOT EXISTS region_event (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      event_id UUID REFERENCES event(id),
      region_id UUID REFERENCES region(id)
    );
    `;
    console.log('create region_event table success');

    // Event-Item table
    await client.sql`
    CREATE TABLE IF NOT EXISTS event_item (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      event_id UUID REFERENCES event(id),
      item_id UUID REFERENCES item(id)
    );`;
    console.log('create event_item table success')

  } catch (error) {

  }
}