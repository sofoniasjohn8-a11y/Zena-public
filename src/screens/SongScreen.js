/**
 * SongScreen.js — Read-only song library for students.
 * Data comes from bundled JSON files — no internet, no database.
 * Interface matches the main ዜና በገና app exactly.
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView, Modal, Platform,
  ImageBackground, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BEGENA_SONGS_RAW from '../data/begena_songs.json';
import ADVANCE_SONGS_RAW from '../data/advance_songs.json';

const BG_IMAGE_SONG  = require('../../assets/song-bg2.jpg');
const MEXMUR_IMG     = require('../../assets/mexmurlist.png');
const LIST_BG        = require('../../assets/mezmurlistbackground.png');

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Build flat song list ──────────────────────────────────────────────────────
function buildSongs() {
  const songs = [];

  // Beginner songs from begena_songs.json
  for (const s of (BEGENA_SONGS_RAW ?? [])) {
    songs.push({
      id:       `b_${s.title}`,
      title:    s.title   ?? '',
      singer:   s.author  ?? '',
      category: s.scale   ?? 'ዝማሬ',
      level:    'ለጀማሪ',
      qegnet:   (s.notation ?? []).join('\n'),
      lyrics:   (s.lyrics   ?? []).join('\n'),
    });
  }

  // Advance songs from advance_songs.json
  for (const section of (ADVANCE_SONGS_RAW.sections ?? [])) {
    for (const song of (section.songs ?? [])) {
      const lyrics = (song.stanzas ?? []).map(st =>
        `[ቁ. ${st.number}]\n${(st.lines ?? []).join('\n')}`
      ).join('\n\n');
      songs.push({
        id:       `a_${song.title}`,
        title:    song.title    ?? '',
        singer:   '',
        category: section.keny ?? 'ዝማሬ',
        level:    'ለአድቫንስ',
        qegnet:   '',
        lyrics,
      });
    }
  }

  return songs;
}

const ALL_SONGS = buildSongs();

// ─── Category colors — exact same as main app ──────────────────────────────────
const CAT_COLORS = {
  'ሰላምታ':          { bg: '#EFF6FF', text: '#1D4ED8', activeBg: '#1D4ED8' },
  'ትዝታ':           { bg: '#F0FDF4', text: '#15803D', activeBg: '#15803D' },
  'ቸርነት':          { bg: '#FEF9C3', text: '#92400E', activeBg: '#92400E' },
  'ዝማሬ':           { bg: '#FEF9C3', text: '#92400E', activeBg: '#92400E' },
  'ንዑስ ትዝታ ቅኝት': { bg: '#F0FDF4', text: '#15803D', activeBg: '#15803D' },
  'ባቲ ቅኝት':       { bg: '#EFF6FF', text: '#1D4ED8', activeBg: '#1D4ED8' },
  'አምባሰል ቅኝት':   { bg: '#FEF9C3', text: '#92400E', activeBg: '#92400E' },
  'ግርፍ':           { bg: '#FEF2F2', text: '#991B1B', activeBg: '#991B1B' },
};

// ─── Level Picker Modal ────────────────────────────────────────────────────────
function LevelPickerModal({ visible, onSelect, onDismiss }) {
  const beginnerCount = ALL_SONGS.filter(s => s.level === 'ለጀማሪ').length;
  const advanceCount  = ALL_SONGS.filter(s => s.level === 'ለአድቫንስ').length;

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onDismiss}>
      <LinearGradient colors={['#020617', '#0F172A', '#1E1B4B']} style={{ flex: 1 }}>

        {/* Top decoration */}
        <View style={lp.topDeco}>
          <Text style={lp.topDecoIcon}>🎼</Text>
          <Text style={lp.topDecoTitle}>የዝማሬ ቤተ-መጻሕፍት</Text>
          <Text style={lp.topDecoSub}>Song Library</Text>
        </View>

        <View style={lp.glow} />
        <Text style={lp.prompt}>የሚፈልጉትን ደረጃ ይምረጡ</Text>

        <View style={lp.cardsWrap}>

          {/* Beginner */}
          <TouchableOpacity style={lp.card} onPress={() => onSelect('ለጀማሪ')} activeOpacity={0.88}>
            <LinearGradient colors={['#064E3B', '#065F46', '#059669']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={lp.cardGrad}>
              <View style={lp.cardContent}>
                <View style={[lp.cardIconCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                  <Text style={lp.cardLevelNum}>1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={lp.cardTitle}>ለጀማሪ</Text>
                  <Text style={lp.cardSub}>Beginner · {beginnerCount} ዝማሬ</Text>
                  <View style={lp.cardCatsRow}>
                    {['ሰላምታ', 'ትዝታ', 'ቸርነት'].map(c => (
                      <View key={c} style={lp.cardCatPill}>
                        <Text style={lp.cardCatPillTxt}>{c}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} style={lp.cardArrow}>
                  <Text style={lp.cardArrowTxt}>›</Text>
                </LinearGradient>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Advance */}
          <TouchableOpacity style={lp.card} onPress={() => onSelect('ለአድቫንስ')} activeOpacity={0.88}>
            <LinearGradient colors={['#78350F', '#92400E', '#D97706']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={lp.cardGrad}>
              <View style={lp.cardContent}>
                <View style={[lp.cardIconCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                  <Text style={lp.cardLevelNum}>2</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={lp.cardTitle}>ለአድቫንስ</Text>
                  <Text style={lp.cardSub}>Advanced · {advanceCount} ዝማሬ</Text>
                  <View style={lp.cardCatsRow}>
                    {['ንዑስ ትዝታ', 'ባቲ', 'አምባሰል', 'ግርፍ'].map(c => (
                      <View key={c} style={[lp.cardCatPill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Text style={lp.cardCatPillTxt}>{c}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} style={lp.cardArrow}>
                  <Text style={lp.cardArrowTxt}>›</Text>
                </LinearGradient>
              </View>
            </LinearGradient>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={lp.cancelBtn} onPress={onDismiss} activeOpacity={0.8}>
          <Text style={lp.cancelTxt}>← ተመለስ</Text>
        </TouchableOpacity>

      </LinearGradient>
    </Modal>
  );
}

const lp = StyleSheet.create({
  topDeco:        { alignItems: 'center', paddingTop: 70, paddingBottom: 10 },
  topDecoIcon:    { fontSize: 52, marginBottom: 10 },
  topDecoTitle:   { fontSize: 26, fontWeight: 'bold', color: '#FCD34D', letterSpacing: 0.5, fontFamily: 'Nyala' },
  topDecoSub:     { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: 2 },
  glow:           { height: 1, backgroundColor: 'rgba(99,102,241,0.6)', marginHorizontal: 40, marginTop: 20, marginBottom: 16 },
  prompt:         { fontSize: 15, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 24, fontFamily: 'Nyala' },
  cardsWrap:      { paddingHorizontal: 20, gap: 16 },
  card:           { borderRadius: 22, overflow: 'hidden', elevation: 10 },
  cardGrad:       { paddingVertical: 24, paddingHorizontal: 20 },
  cardContent:    { flexDirection: 'row', alignItems: 'center', gap: 16 },
  cardIconCircle: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  cardLevelNum:   { fontSize: 32, fontWeight: '900', color: '#FFF' },
  cardTitle:      { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 2, fontFamily: 'Nyala' },
  cardSub:        { fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, marginBottom: 10 },
  cardCatsRow:    { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  cardCatPill:    { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  cardCatPillTxt: { fontSize: 11, color: '#FFF', fontWeight: '600', fontFamily: 'Nyala' },
  cardArrow:      { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cardArrowTxt:   { fontSize: 22, color: '#FFF', fontWeight: 'bold' },
  cancelBtn:      { marginTop: 32, alignItems: 'center', paddingVertical: 14 },
  cancelTxt:      { fontSize: 15, color: 'rgba(255,255,255,0.45)', fontWeight: '600' },
});

// ─── Song Detail Modal ─────────────────────────────────────────────────────────
function SongDetailModal({ song, onClose }) {
  if (!song) return null;

  return (
    <Modal visible={!!song} animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <ImageBackground source={BG_IMAGE_SONG} style={{ flex: 1 }} resizeMode="stretch">

        {/* Spacer for the artwork at top */}
        <View style={{ height: SCREEN_HEIGHT * 0.32 }} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={det.frameContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <View style={det.frameHeaderRow}>
            <TouchableOpacity onPress={onClose} style={det.frameBackBtn}>
              <Text style={det.frameBackTxt}>← ተመለስ</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={det.frameSongTitle}>{song.title}</Text>
          <View style={det.frameTitleDivider} />

          {/* Singer + category */}
          <View style={det.frameMetaRow}>
            {song.singer ? (
              <View style={det.frameMetaChip}>
                <Text style={det.frameMetaChipText}>🎤  {song.singer}</Text>
              </View>
            ) : null}
            {song.category ? (
              <View style={[det.frameMetaChip, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                <Text style={[det.frameMetaChipText, { color: '#92400E' }]}>🎼  {song.category}</Text>
              </View>
            ) : null}
          </View>

          {/* Qegnet */}
          {song.qegnet ? (
            <View style={det.frameSection}>
              <Text style={det.frameSectionLabel}>✦  ቅኝት  ✦</Text>
              <Text style={det.frameQegnetText}>{song.qegnet}</Text>
            </View>
          ) : null}

          {/* Lyrics */}
          {song.lyrics ? (
            <View style={det.frameSection}>
              <Text style={det.frameSectionLabel}>✦  ግጥም  ✦</Text>
              <Text style={det.frameLyricsText}>{song.lyrics}</Text>
            </View>
          ) : null}

          <View style={{ height: 60 }} />
        </ScrollView>
      </ImageBackground>
    </Modal>
  );
}

const det = StyleSheet.create({
  frameContent:      { paddingHorizontal: '8%', paddingTop: 10, paddingBottom: 120 },
  frameHeaderRow:    { flexDirection: 'row', marginBottom: 10 },
  frameBackBtn:      { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#1C1917', borderWidth: 1.5, borderColor: '#C58B12' },
  frameBackTxt:      { fontSize: 13, fontWeight: '700', color: '#FCD34D' },

  // Song title — deep brown on parchment
  frameSongTitle:    {
    fontSize: 24, fontWeight: 'bold', color: '#4A1C00',
    textAlign: 'center', fontFamily: 'Nyala',
    marginBottom: 6, letterSpacing: 1,
    textShadowColor: 'rgba(197,139,18,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  frameTitleDivider: {
    height: 1.5, backgroundColor: '#B8860B',
    marginHorizontal: '15%', marginBottom: 12, opacity: 0.7,
  },

  frameMetaRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 14 },
  frameMetaChip:     { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, backgroundColor: 'rgba(184,134,11,0.15)', borderWidth: 1.5, borderColor: '#B8860B' },
  frameMetaChipText: { fontSize: 13, fontWeight: '700', color: '#4A1C00', fontFamily: 'Nyala' },

  frameSection:      { marginBottom: 16 },

  frameSectionLabel: {
    fontSize: 13, fontWeight: '800', color: '#B8860B',
    textAlign: 'center', letterSpacing: 2, marginBottom: 10,
    fontFamily: 'Nyala',
  },

  // Qegnet — deep navy
  frameQegnetText:   {
    fontSize: 24, fontWeight: '900', color: '#1E3A8A',
    lineHeight: 38, textAlign: 'center',
    fontFamily: 'Nyala', letterSpacing: 0.5,
    backgroundColor: 'rgba(30,58,138,0.07)',
    borderRadius: 10, padding: 12,
    borderLeftWidth: 3, borderLeftColor: '#1E3A8A',
  },

  // Lyrics — rich dark brown
  frameLyricsText:   {
    fontSize: 17, lineHeight: 34,
    color: '#2D1B00',
    fontFamily: 'Nyala', textAlign: 'center',
    letterSpacing: 0.2,
  },
});

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function SongScreen({ navigation }) {
  const [level,      setLevel]      = useState(null);
  const [filterCat,  setFilterCat]  = useState('ሁሉም');
  const [query,      setQuery]      = useState('');
  const [detailSong, setDetailSong] = useState(null);

  const availableCats = useMemo(() => {
    if (!level) return [];
    const cats = new Set(ALL_SONGS.filter(s => s.level === level).map(s => s.category));
    return ['ሁሉም', ...cats];
  }, [level]);

  const displayed = useMemo(() => {
    if (!level) return [];
    let list = ALL_SONGS.filter(s => s.level === level);
    if (filterCat !== 'ሁሉም') list = list.filter(s => s.category === filterCat);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(s =>
        s.title?.toLowerCase().includes(q) ||
        s.singer?.toLowerCase().includes(q) ||
        s.qegnet?.includes(q) ||
        s.lyrics?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [level, filterCat, query]);

  return (
    <View style={styles.container}>

      {/* Level picker */}
      <LevelPickerModal
        visible={!level}
        onSelect={l => { setLevel(l); setFilterCat('ሁሉም'); setQuery(''); }}
        onDismiss={() => navigation.goBack()}
      />

      {level && (
        <>
          {/* Header */}
          <LinearGradient
            colors={['#0F172A', '#1E3A8A', '#0F172A']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.heroBar}
          >
            <TouchableOpacity onPress={() => setLevel(null)} style={styles.backBtn}>
              <Text style={styles.backTxt}>←</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{level}</Text>
              <Text style={styles.heroSub}>{displayed.length} ዝማሬ</Text>
            </View>
          </LinearGradient>

          {/* Search — above the background image */}
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="ርዕስ ወይም ዘማሪ ፈልግ…"
              placeholderTextColor="rgba(28,10,0,0.4)"
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Category chips — above the background image */}
          <View style={styles.catRow}>
            {availableCats.map(c => {
              const active = filterCat === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.catChip,
                    active
                      ? { backgroundColor: '#B8860B', borderColor: '#B8860B' }
                      : { backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'rgba(184,134,11,0.4)' }
                  ]}
                  onPress={() => setFilterCat(c)}
                >
                  {active && <Text style={styles.catChipIcon}>🎵 </Text>}
                  <Text style={[styles.catTxt, { color: active ? '#FFF' : '#1C0A00' }]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Background image wraps only the song list */}
          <ImageBackground source={LIST_BG} style={{ flex: 1 }} resizeMode="stretch">
            <View style={{ flex: 1, paddingTop: SCREEN_HEIGHT * 0.06 }}>

              {/* Song list */}
              <FlatList
                data={displayed}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 6, paddingBottom: SCREEN_HEIGHT * 0.18 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const cc = CAT_COLORS[item.category];
                  return (
                    <TouchableOpacity
                      style={styles.songCard}
                      onPress={() => setDetailSong(item)}
                      activeOpacity={0.85}
                    >
                      <Image source={MEXMUR_IMG} style={styles.songThumb} resizeMode="cover" />

                      <View style={styles.songContent}>
                        <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                        {item.singer ? (
                          <Text style={styles.songSinger} numberOfLines={1}>✏️ {item.singer}</Text>
                        ) : null}
                        {item.qegnet ? (
                          <Text style={styles.songQegnet} numberOfLines={1}>🎵 {item.qegnet.split('\n')[0]}</Text>
                        ) : null}
                      </View>

                      <View style={styles.songRight}>
                        <View style={[styles.catBadge, { backgroundColor: cc?.bg ?? '#EFF6FF', borderColor: cc?.activeBg ?? '#1E3A8A' }]}>
                          <Text style={[styles.catBadgeTxt, { color: cc?.text ?? '#1E3A8A' }]}>{item.category}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.emptyBox}>
                    <Text style={{ fontSize: 52, marginBottom: 14 }}>🎶</Text>
                    <Text style={styles.emptyTitle}>ዝማሬ አልተገኘም</Text>
                    <Text style={styles.emptyHint}>
                      {query ? '"✕" ይጫኑ ፍለጋ ለማጥፋት' : 'ምድብ ይምረጡ'}
                    </Text>
                  </View>
                }
              />
            </View>
          </ImageBackground>

          <SongDetailModal song={detailSong} onClose={() => setDetailSong(null)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  heroBar:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 18 : 14, paddingBottom: 16, gap: 10 },
  backBtn:   { width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18 },
  backTxt:   { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  heroSub:   { fontSize: 14, color: '#94A3B8', marginTop: 2 },

  searchWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 16, paddingHorizontal: 14, height: 48, marginHorizontal: 16,
    marginBottom: 6, borderWidth: 1.5, borderColor: 'rgba(184,134,11,0.5)',
    marginTop: 8 },
  searchIcon:  { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#1C0A00', paddingVertical: 0, fontFamily: 'Nyala' },
  clearBtn:    { fontSize: 14, paddingLeft: 8, color: '#B8860B' },

  catRow:     { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingBottom: 10, paddingTop: 2, gap: 8, backgroundColor: '#F5F5F4' },
  catChip:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 22, borderWidth: 1.5 },
  catChipIcon:{ fontSize: 12 },
  catTxt:     { fontSize: 14, fontWeight: '700', fontFamily: 'Nyala' },

  songCard:    { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14, marginBottom: 8, padding: 10, marginHorizontal: 2,
    borderLeftWidth: 3, borderLeftColor: '#B8860B',
    elevation: 2, shadowColor: '#B8860B', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, shadowRadius: 3 },
  songThumb:   { width: 58, height: 58, borderRadius: 12, marginRight: 12 },
  songContent: { flex: 1, paddingRight: 8 },
  songTitle:   { fontSize: 17, fontWeight: 'bold', color: '#1C0A00', marginBottom: 3, fontFamily: 'Nyala' },
  songSinger:  { fontSize: 13, color: '#44403C', marginBottom: 2, fontFamily: 'Nyala' },
  songQegnet:  { fontSize: 13, color: '#1E3A8A', fontWeight: '800', fontFamily: 'Nyala' },
  songRight:   { alignItems: 'flex-end' },
  catBadge:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1.5 },
  catBadgeTxt: { fontSize: 11, fontWeight: '700', fontFamily: 'Nyala' },

  emptyBox:    { alignItems: 'center', paddingTop: 80 },
  emptyTitle:  { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#0F172A', fontFamily: 'Nyala' },
  emptyHint:   { fontSize: 14, textAlign: 'center', paddingHorizontal: 32, lineHeight: 22, color: '#64748B', fontFamily: 'Nyala' },
});
