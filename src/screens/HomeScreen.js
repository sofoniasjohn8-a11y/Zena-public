import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ImageBackground, TouchableOpacity, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

const BG = require('../../assets/back-2.jpg');

const INFO_ITEMS = [
  {
    icon: '🎵',
    title: 'ዜና በገና ምንድን ነው?',
    body: 'ዜና በገና — መንፈሳዊ የዜማ መሳሪያ ማሰልጠኛ ተቋም ነው። ተቋሙ ባህላዊ የኢትዮጵያ ሙዚቃ መሳሪያዎችን ለተማሪዎች ያስተምራል።',
  },
  {
    icon: '🏫',
    title: 'ምን ምን መሳሪያዎች ይማሩ?',
    body: 'በዚህ ተቋም የሚከተሉት መሳሪያዎች ይማሩ:\n• በገና — ጥንታዊ የኢትዮጵያ ዝሙቅ\n• ክራር — ሕዝባዊ አሰቃቅ ዜማ\n• ዋሽንት — ንፋሳዊ ዜማ\n• መሰንቆ — ቀስቃሽ ዜማ',
  },
  {
    icon: '📚',
    title: 'ስለዚህ መተግበሪያ',
    body: 'ይህ መተግበሪያ ለዜና በገና ተማሪዎች የዝማሬ ቤተ-መጻሕፍት ሲሆን ሁሉም ዝማሬዎች ያለ ኢንተርኔት ይሰራሉ።\n\nለጀማሪ እና ለከፍተኛ ደረጃ ተማሪዎች ተዘጋጅቷል።',
  },
  {
    icon: '🎓',
    title: 'ደረጃዎች',
    body: '• ለጀማሪ — መሰረታዊ ዝማሬዎች እና ቅኝቶች\n• ለአድቫንስ — ከፍተኛ ደረጃ ዝማሬዎች\n\nእያንዳንዱ ዝማሬ ቅኝቱ፣ ምድቡ እና ግጥሙ ተጠቅሷል።',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero banner ── */}
      <ImageBackground source={BG} style={styles.hero} resizeMode="cover">
        <LinearGradient
          colors={['rgba(28,25,23,0.3)', 'rgba(28,25,23,0.85)', '#1C1917']}
          style={styles.heroGrad}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>𝄞</Text>
            <Text style={styles.heroTitle}>ዜና በገና</Text>
            <Text style={styles.heroSub}>መንፈሳዊ የዜማ መሳሪያ ማሰልጠኛ ተቋም</Text>
            <View style={styles.heroDivider} />
            <Text style={styles.heroTagline}>የዝማሬ ቤተ-መጻሕፍት</Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* ── Stats row ── */}
      <View style={styles.statsRow}>
        {[
          { num: '4', label: 'መሳሪያዎች' },
          { num: '2', label: 'ደረጃዎች' },
          { num: '20+', label: 'ዝማሬዎች' },
          { num: '100%', label: 'ያለ ኔት' },
        ].map((s, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={styles.statNum}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Info cards ── */}
      {INFO_ITEMS.map((item, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
          <Text style={styles.cardBody}>{item.body}</Text>
        </View>
      ))}

      {/* ── Bottom note ── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ዜና በገና © {new Date().getFullYear()}
        </Text>
        <Text style={styles.footerSub}>
          ሁሉም ዝማሬዎች ያለ ኢንተርኔት ይሰራሉ
        </Text>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F4' },
  content:   { paddingBottom: 20 },

  // Hero
  hero:     { height: 320 },
  heroGrad: { flex: 1, justifyContent: 'flex-end' },
  heroContent: { alignItems: 'center', paddingBottom: 32, paddingHorizontal: 24 },
  heroEmoji: { fontSize: 52, color: '#FCD34D', marginBottom: 8 },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF8E7', letterSpacing: 2, textAlign: 'center' },
  heroSub:   { fontSize: 13, color: '#A8A29E', textAlign: 'center', marginTop: 4, letterSpacing: 0.5 },
  heroDivider: { width: 60, height: 2, backgroundColor: '#C9A84C', marginVertical: 12 },
  heroTagline: { fontSize: 14, color: '#FCD34D', fontWeight: '600', letterSpacing: 1 },

  // Stats
  statsRow: {
    flexDirection: 'row', backgroundColor: '#1C1917',
    paddingVertical: 16, paddingHorizontal: 8,
  },
  statItem:  { flex: 1, alignItems: 'center' },
  statNum:   { fontSize: 20, fontWeight: 'bold', color: '#FCD34D' },
  statLabel: { fontSize: 10, color: '#A8A29E', marginTop: 2 },

  // Cards
  card: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 14,
    borderRadius: 16, padding: 18, elevation: 2,
    borderWidth: 1, borderColor: '#E7E5E4',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  cardIcon:   { fontSize: 24 },
  cardTitle:  { fontSize: 15, fontWeight: '800', color: '#1C1917', flex: 1 },
  cardBody:   { fontSize: 13, color: '#78716C', lineHeight: 22 },

  // Footer
  footer:    { alignItems: 'center', marginTop: 24, paddingHorizontal: 24 },
  footerText:{ fontSize: 13, color: '#A8A29E', fontWeight: '600' },
  footerSub: { fontSize: 11, color: '#C4B5A0', marginTop: 4 },
});
