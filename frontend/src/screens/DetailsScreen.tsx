import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MovieDetails  } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsSceen({ route }: Props) {
    const { imdbID } = route.params;
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovie();
    }, [imdbID]);

    const fetchMovie = async () => {
        try {
            const response = await fetch(`http://localhost:3000/movie/${imdbID}`);
            const data = await response.json();

            if (data.Response === 'False') {
                Alert.alert('Error', 'Movie details not found');
                return;
            }

            setMovie(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load details')
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#004AFF"/>
            </View>
        );
    }

    if (!movie) return null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image 
            source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300' }}
            style={styles.poster}
            resizeMode="contain"
            />

            <Text style={styles.title}>{movie.Title}</Text>

            <View style={styles.infoRow}>
                <Text style={styles.year}>{movie.Year}</Text>
                <Text style={styles.rating}>{movie.Rated}</Text>
                <Text style={styles.runtime}>{movie.Runtime}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Plot</Text>
                <Text style={styles.plot}>{movie.Plot}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Genre</Text>
                <Text style={styles.value}>{movie.Genre}</Text>

                <Text style={styles.label}>Director:</Text>
                <Text style={styles.value}>{movie.Director}</Text>

                <Text style={styles.label}>Cast</Text>
                <Text style={styles.value}>{movie.Actors}</Text>

                <Text style={styles.label}>IMDb Rating</Text>
                <Text style={styles.value}>{movie.imdbRating}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { padding: 20, backgroundColor: '#fff' },
    poster: { width: '100%', height: 400, borderRadius: 12, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#333' },
    infoRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 20 },
    year: { fontSize: 16, color: '#666' },
    rating: { fontSize: 16, fontWeight: 'bold', color: '#444', borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 6, borderRadius: 4 },
    runtime: { fontSize: 16, color: '#666' },
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8, color: '#222' },
    plot: { fontSize: 16, lineHeight: 24, color: '#444' },
    label: { fontSize: 14, color: '#888', marginTop: 10 },
    value: { fontSize: 16, color: '#222', fontWeight: '500' },
    ratingValue: { fontSize: 18, fontWeight: 'bold', color: '#f5c518' }
});