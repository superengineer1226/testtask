import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TRACKS } from '../apollo/query/getTracks';

interface Track {
  id: number;
  name: string;
  artist: {
    name: string;
  };
  genre: string;
}

interface TracksProps {
  artistName?: string;
  genreName?: string;
  minPrice?: number;
  maxPrice?: number;
}

function Tracks({ artistName = "", genreName = "", minPrice = 1, maxPrice = 100000 }: TracksProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading: queryLoading, error } = useQuery(GET_TRACKS, {
    variables: {
      artistName,
      genreName,
      minPrice,
      maxPrice,
      page,
      pageSize,
    },
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error(error);
    },
    onCompleted: (data) => {
      console.log(data.getTracks);
      setTracks((prevTracks) => [...prevTracks, ...data.getTracks]);
      setLoading(false);
      setHasMore(data.getTracks.length === pageSize);
    },
  });

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      setPage(page + 1);
    }
  };

  if (error) {
    return <div>Error loading tracks: {error.message}</div>;
  }

  return (
    <div>
      <ul>
        {tracks.map((track: Track) => (
          <li key={track.id}>
            {track.name} - {track.artist.name} - {track.genre}
          </li>
        ))}
      </ul>
      {loading && <div>Loading...</div>}
      {!loading && hasMore && (
        <button onClick={handleLoadMore}>Load more</button>
      )}
      {!loading && !hasMore && <div>No more tracks to load</div>}
    </div>
  );
}

export default Tracks;
