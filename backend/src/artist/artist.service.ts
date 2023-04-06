import { Injectable } from '@nestjs/common';
import { Database } from 'sqlite3';

interface Artist {
    id: number;
    name: string;
}

@Injectable()
export class ArtistService {
    constructor(private readonly db: Database) { }

    async findByIds(ids: number[]): Promise<Artist[]> {
        const placeholders = ids.map(() => '?').join(',');
        const query = 'SELECT * FROM Artist WHERE ArtistId IN (' + placeholders + ');';
        return new Promise<Artist[]>((resolve, reject) => {
            this.db.all(query, ids, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const artists = rows.map((row: any) => ({
                        id: row.ArtistId,
                        name: row.Name,
                    }));
                    resolve(artists);
                }
            });
        });
    }

}
