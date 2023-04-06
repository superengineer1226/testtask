import { gql } from "@apollo/client";
export const GET_TRACKS = gql`
  query GetTracks(
    $artistName: String!,
    $genreName: String!,
    $minPrice: Float!,
    $maxPrice: Float!,
    $page: Float!,
    $pageSize: Float!
  ) {
    getTracks(
      artistName: $artistName
      genreName: $genreName
      minPrice: $minPrice
      maxPrice: $maxPrice
      page: $page
      pageSize: $pageSize
    ) {
      id
      name
      price
      duration
      genre
      artist {
        id
        name
      }
    }
  }
`;
