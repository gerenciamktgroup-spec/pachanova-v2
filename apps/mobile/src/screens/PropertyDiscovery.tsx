import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';

const properties = [
  { id: '1', title: 'San Bartolo Genesis', nav: '$185,000', apy: '14.5%', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop' },
  { id: '2', title: 'Lurin Expansion', nav: '$450,000', apy: '12.8%', image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2940&auto=format&fit=crop' }
];

export default function PropertyDiscoveryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>Premium Real Estate Opportunities</Text>
        </View>

        {properties.map((prop) => (
          <TouchableOpacity key={prop.id} style={styles.card} activeOpacity={0.9}>
            <Image source={{ uri: prop.image }} style={styles.image} />
            <View style={styles.overlay}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{prop.apy} APY</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{prop.title}</Text>
              <Text style={styles.cardNav}>NAV: {prop.nav}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#8a8f9a',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222222',
  },
  image: {
    width: '100%',
    height: 250,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#b8a17a',
  },
  badgeText: {
    color: '#b8a17a',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardNav: {
    fontSize: 16,
    color: '#4ade80',
  }
});
