import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Image,
} from 'react-native';
import { COLORS } from '../constants/colors';

// ─── Images ────────────────────────────────────────────────────────────────────
const STAFF_IMAGE = require('../../assets/memhrzena.jpg');

const INSTRUMENT_IMAGES = {
  'በገና':  require('../../assets/begena.jpg'),
  'ክራር':  require('../../assets/kirar.jpg'),
  'ዋሽንት': require('../../assets/washnt.jpg'),
  'መሰንቆ': require('../../assets/mesenko.jpg'),
};

const INSTRUMENTS = [
  { name: 'በገና',  desc: 'ጥንታዊ ዋና ዜማ' },
  { name: 'ክራር',  desc: 'ሕዝባዊ ዜማ' },
  { name: 'ዋሽንት', desc: 'ንፋሳዊ ዜማ' },
  { name: 'መሰንቆ', desc: 'ቀስቃሽ ዜማ' },
];

// Song counts from bundled data
import BEGENA_SONGS from '../data/begena_songs.json';
import ADVANCE_SONGS from '../data/advance_songs.json';

const BEGINNER_COUNT = Array.isArray(BEGENA_SONGS) ? BEGENA_SONGS.length : 0;
const ADVANCE_COUNT  = (ADVANCE_SONGS.sections ?? []).reduce((s, sec) => s + sec.songs.length, 0);
const TOTAL_SONGS    = BEGINNER_COUNT + ADVANCE_COUNT;

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar backgroundColor="#1C1917" barStyle="light-content" />

      {/* ══ 1. HERO PHOTO ══ */}
      <View style={styles.heroWrap}>
        <Image source={STAFF_IMAGE} style={styles.hero} resizeMode="contain" />
      </View>

      {/* ══ 2. STATS STRIP ══ */}
      <View style={styles.statsStrip}>
        {[
          { label: 'ዝማሬዎች',    value: TOTAL_SONGS,      color: COLORS.primary     },
          { label: 'ለጀማሪ',     value: BEGINNER_COUNT,   color: '#16A34A'           },
          { label: 'ለአድቫንስ',   value: ADVANCE_COUNT,    color: '#D97706'           },
          { label: 'መሳሪያዎች',  value: 4,                color: COLORS.textPrimary  },
        ].map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={styles.statsDivider} />}
            <View style={styles.statsItem}>
              <Text style={[styles.statsValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statsLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                {s.label}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* ══ 3. ABOUT CARD ══ */}
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>ዜና በገና ምንድን ነው?</Text>
        <Text style={styles.aboutText}>
          ዜና በገና — መንፈሳዊ የዜማ መሳሪያ ማሰልጠኛ ተቋም ሲሆን ለኢትዮጵያ ባህላዊ ሙዚቃ ተማሪዎች
          የዝማሬ ቤተ-መጻሕፍት እና ትምህርታዊ ቁሳቁስ ይሰጣል።{'\n\n'}
          ይህ መተግበሪያ ለተማሪዎች ዝማሬዎቻቸውን ያለ ኢንተርኔት እንዲያነቡ ተዘጋጅቷል።
        </Text>
      </View>

      {/* ══ 4. INSTRUMENT TILES ══ */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>የ4ቱ የዜማ ስልጠናዎች</Text>
          <TouchableOpacity
            style={styles.sectionLink}
            onPress={() => navigation.navigate('SongsTab')}
          >
            <Text style={styles.sectionLinkTxt}>ዝማሬዎች ›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.instrGrid}>
          {INSTRUMENTS.map(item => (
            <TouchableOpacity
              key={item.name}
              style={styles.instrTile}
              onPress={() => navigation.navigate('SongsTab')}
              activeOpacity={0.75}
            >
              <Image
                source={INSTRUMENT_IMAGES[item.name]}
                style={styles.instrImg}
                resizeMode="cover"
              />
              <View style={styles.instrMeta}>
                <Text style={styles.instrName}>{item.name}</Text>
                <Text style={styles.instrDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F4' },

  // 1. Hero photo
  heroWrap: { width: '100%', height: 320, backgroundColor: '#1C1917' },
  hero:     { width: '100%', height: '100%' },

  // 2. Stats strip
  statsStrip:   {
    flexDirection: 'row', backgroundColor: '#FFF',
    marginHorizontal: 14, marginTop: -20,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 14, paddingHorizontal: 4,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.08,
    shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  statsItem:    { flex: 1, alignItems: 'center', paddingHorizontal: 2 },
  statsDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  statsValue:   { fontSize: 20, fontWeight: '800', marginBottom: 4, fontFamily: 'Nyala' },
  statsLabel:   { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600', textAlign: 'center', fontFamily: 'Nyala' },

  // 3. About card
  aboutCard: {
    backgroundColor: '#FFF', marginHorizontal: 14, marginTop: 20,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    padding: 16, elevation: 1,
  },
  aboutTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8, fontFamily: 'Nyala' },
  aboutText:  { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22, fontFamily: 'Nyala' },

  // 4. Instrument section
  section:       {
    backgroundColor: '#FFF', marginHorizontal: 14, marginTop: 20,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden', elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  sectionTitle:  { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, fontFamily: 'Nyala' },
  sectionLink:   { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#FEF3C7', borderRadius: 20 },
  sectionLinkTxt:{ fontSize: 11, fontWeight: 'bold', color: '#92400E', fontFamily: 'Nyala' },
  instrGrid:     { flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 10 },
  instrTile:     {
    width: '47%', backgroundColor: '#FFF8F0',
    borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A', overflow: 'hidden',
  },
  instrImg:  { width: '100%', height: 100 },
  instrMeta: { paddingVertical: 8, paddingHorizontal: 10 },
  instrName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 2, fontFamily: 'Nyala' },
  instrDesc: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', fontFamily: 'Nyala' },
});
