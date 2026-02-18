import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, FlatList, ActivityIndicator, Alert, SafeAreaViewBase, Image  } from 'react-native';

//same shape as backend response
interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

//
interface OmdbResponse {
  Search?: Movie[];
  totalResulst?: string;
  Response?: string;
}

export default function App() {
  const [query, setQuery] = useState<string>(''); //input
  const [movies, setMovies] = useState<Movie[]>([]); //List
  const [loading, setLoading] = useState<boolean>(false); //loading icon
  const [error, setError] = useState<string>(''); //error alert

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const callBackend = useCallback(async (searchQuery: string, page: number =1 ) =>{
    //prevets empry search
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }

    setLoading(true);
    setError('');

    try {

      const BACKEND_BASE = 'http://localhost:3000';
      // nestJs backend
      const response = await fetch(`${BACKEND_BASE}/search?q=${encodeURIComponent(searchQuery)}&page=${page}`);


      if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      const payload = ('data' in json && json.data) ? json.data : json;

      if (payload.Response === 'False') {
        setMovies([]);
        setError('No Movies Found');
        return;
      }

      if (page === 1) {
        setMovies(payload.Search || []);
      } else {
        setMovies(prev => [...prev, ...(payload.Search || [])]);
      }
      if (page >= 3) {
        setHasMore(false);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreMovies = useCallback (() => {

    if (!hasMore) {
      console.log('No more pages to load')
      return;
    }

    if (loadingMore) {
      console.log('Alreayd loaded more')
      return;
    }

    if (currentPage >= 3) {
      console.log('Reached max pages')
      setHasMore(false)
      return;
    }

    console.log(`Loading page ${currentPage + 1}`);
    setLoadingMore(true);

    const nextPage = currentPage + 1;

    callBackend(query, nextPage).then(() => {
      setCurrentPage(nextPage);
      setLoadingMore(false);
    });
  }, [hasMore, loadingMore, currentPage, query, callBackend]);

  //skips emptry query
  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    setCurrentPage(1);
    setHasMore(true);

    //cancels pending query
    const timer = setTimeout(() => {
      callBackend(query, 1);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, callBackend]); //starts over when query or callBackend changes.


  const renderMovie = useCallback(({item}: {item: Movie}) => (

    <View style={styles.movieRow}>
        <Image
        source={{ uri: item.Poster }}
        style={styles.Poster}
        />
      
        <View style={styles.MovieText}>
          <Text style={styles.title} numberOfLines={2}>{item.Title}</Text>
          <Text style={styles.year}>{item.Year}</Text>
        </View>
    </View>
  ), []);

  const keyExtractor = useCallback((item: Movie) => item.imdbID, []);
  console.log('render - movie', movies.length, 'loading:', loading)
  return ( 
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}> Movie Browser </Text>

      <Text style={{padding: 20}}>
        Debug: {movies.length} movies | {loading ? 'loading...' : 'idle'}
      </Text>

      <TextInput
      style={styles.input}
      placeholder="Search movies (e.g. 'star wars')"
      value={query}
      onChangeText={setQuery}
      autoCorrect={false}
      returnKeyType="search"
      />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text> Loading results...</Text>
        </View>
      )}

      {error ? (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
      data={movies}
      renderItem={renderMovie}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        !loading ? (
          <Text style={styles.empty}>Enter a search term above</Text>
        ) : null
      }
      onEndReached={loadMoreMovies}
      onEndReachedThreshold={0.8}

      ListFooterComponent={
        loadingMore ? (
          <View style={styles.loadingFooter}>
            <ActivityIndicator size="small" color="#007AFF"/>
            <Text style={styles.footerText}>Loading More</Text>
          </View>
        ) : null
      }
    />
      
    </SafeAreaView>
  )


  

};

const styles = StyleSheet.create({
  // === LAYOUT ===
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  }, // Full screen, light gray bg
  
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    padding: 20, 
    textAlign: 'center',
    color: '#1a1a1a'
  }, // Bold title

  input: { 
    backgroundColor: 'white', 
    margin: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 15, 
    borderRadius: 12, 
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  }, // Elevated search bar

  // === MOVIE ROW ===
  movieRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    marginHorizontal: 20, 
    marginVertical: 5,
    backgroundColor: 'white', 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  MovieText: { 
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    marginHorizontal: 20, 
    marginVertical: 5,
    backgroundColor: '#f5f5f5', 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  Poster: {
    width: 90,
    height: 135,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  
  title: { 
    fontSize: 16, 
    fontWeight: '600', 
    flex: 1, // Takes remaining space
    color: '#1a1a1a'
  },
  
  year: { 
    fontSize: 14, 
    color: '#666', 
    marginLeft: 10,
    minWidth: 50 // Prevents layout jump
  },

  // === LOADING STATE ===
  loading: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },

  loadingFooter: {
  paddingVertical: 20,
  alignItems: 'center',
},

footerText: {
  marginTop: 8,
  fontSize: 14,
  color: '#666',
},

  // === ERROR STATE ===
  error: {
    backgroundColor: '#fee',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f66',
  },
  
  errorText: {
    color: '#c33',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500'
  },

  // === EMPTY STATE ===
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 50,
  },
  
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    lineHeight: 24,
    marginBottom: 10
  },

  // === LIST ===
  list: {
    paddingBottom: 20,
  },
});
