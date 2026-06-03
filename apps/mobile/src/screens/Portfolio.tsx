import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

export default function PortfolioScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio</Text>
          <Text style={styles.subtitle}>Your Digital Land Banking Assets</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Asset Value</Text>
          <Text style={styles.balanceValue}>$42,500.00</Text>
          <View style={styles.profitContainer}>
            <Text style={styles.profitText}>+12.5% ($4,722.22) All Time</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Staking Rewards</Text>
        <View style={styles.rewardsCard}>
          <View style={styles.rewardRow}>
            <Text style={styles.rewardLabel}>Unclaimed Yield (USDC)</Text>
            <Text style={styles.rewardValue}>$120.45</Text>
          </View>
          <View style={[styles.rewardRow, styles.noBorder]}>
            <Text style={styles.rewardLabel}>Total Earned YTD</Text>
            <Text style={styles.rewardValue}>$1,200.50</Text>
          </View>
        </View>

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
  balanceCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b8a17a',
    marginBottom: 30,
  },
  balanceLabel: {
    color: '#8a8f9a',
    fontSize: 16,
    marginBottom: 10,
  },
  balanceValue: {
    color: '#b8a17a',
    fontSize: 48,
    fontWeight: '300',
    marginBottom: 15,
  },
  profitContainer: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profitText: {
    color: '#4ade80',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  rewardsCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222222',
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  rewardLabel: {
    color: '#8a8f9a',
    fontSize: 16,
  },
  rewardValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
});
