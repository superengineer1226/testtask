import { Injectable } from '@nestjs/common';
import { Database } from 'sqlite3';
import { IsString, IsNumber, Min, Max, IsPositive, validate } from 'class-validator';
class GetTracksInput {
  @IsString()
  artistName: string;

  @IsString()
  genreName: string;

  @IsNumber()
  @Min(0)
  minPrice: number;

  @IsNumber()
  maxPrice: number;

  @IsNumber()
  @IsPositive()
  page: number;

  @IsNumber()
  @IsPositive()
  pageSize: number;
}
export interface TrackData {
  id: number;
  name: string;
  price: number;
  duration: number;
  genre: string;
  artistId: number; // only return artistId instead of the whole artist object
}

@Injectable()
export class TrackService {

  constructor(private readonly db: Database) {
    this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_track_name ON Track(Name);
      CREATE INDEX IF NOT EXISTS idx_track_unit_price ON Track(UnitPrice);
      CREATE INDEX IF NOT EXISTS idx_genre_name ON Genre(Name);
      CREATE INDEX IF NOT EXISTS idx_album_artist_id ON Album(ArtistId);
    `);
  }

  async getTracks(
    artistName: string,
    genreName: string,
    minPrice: number,
    maxPrice: number,
    page: number,
    pageSize: number,
  ): Promise<TrackData[]> {
    const input = new GetTracksInput();
    input.artistName = artistName;
    input.genreName = genreName;
    input.minPrice = minPrice;
    input.maxPrice = maxPrice;
    input.page = page;
    input.pageSize = pageSize;

    const errors = await validate(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const offset = page * pageSize;
    const limit = pageSize;

    const query = `
    SELECT t.TrackId AS id, t.Name AS name, t.UnitPrice AS price, t.Milliseconds/1000 AS duration, g.Name AS genre,
    a.ArtistId AS artistId
    FROM (
        SELECT *
        FROM Track
        WHERE Name LIKE ?
            AND UnitPrice >= ?
            AND UnitPrice < ?
    ) t
    INNER JOIN Genre g ON t.GenreId = g.GenreId
    INNER JOIN Album al ON t.AlbumId = al.AlbumId
    INNER JOIN Artist a ON al.ArtistId = a.ArtistId
    WHERE g.Name LIKE ?
    ORDER BY t.Name
    LIMIT ? OFFSET ?;
  `;

    return new Promise<TrackData[]>((resolve, reject) => {
      this.db.all(query, [`%${artistName}%`, minPrice, maxPrice, `%${genreName}%`, limit, offset], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          const tracks = rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            price: row.price,
            duration: row.duration,
            genre: row.genre,
            artistId: row.artistId, // return only artistId
          }));
          resolve(tracks);
        }
      });
    });

  }
}
