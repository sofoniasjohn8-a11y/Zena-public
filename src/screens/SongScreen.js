import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, ScrollView, ImageBackground,
} from 'react-native';
import { COLORS } from '../constants/colors';
import BEGENA_SONGS from '../data/begena_songs.json';
import ADVANCE_SONGS from '../data/advance_songs.json';

const BG = require('../../assets/back-2.jpg');

// ─── Build flat song list from both JSON files ─────────────────────────────────
function buildSongs() {
  const songs = [];

  // Beginner songs
  for (const s of (BEGENA_SONGS ?? [])) {
    songs.push({
      id:       `b_${s.title}`,
      title:    s.title ?? '',
      author:   s.author ?? '',
      category: s.scale  ?? 'ዝማሬ',
      level:    'ለጀማሪ',
      notation: (s.notation ?? []).join('\n'),
      lyrics:   (s.lyrics   ?? []).join('\n'),
    });
  }

  // Advance songs
  for (const section of (ADVANCE_SONGS.sections ?? [])) {
    for (const song of (section.songs ?? [])) {
      const lyrics = (song.stanzas ?? []).map(st =>
        `[ቁ. ${st.number}]\n${(st.lines ?? []).join('\n')}`
      ).join('\n\n');
      songs.push({
        id:       `a_${song.title}`,
        title:    song.title    ?? '',
        author:   '',
        category: section.keny ?? 'ዝማሬ',
        level:    'ለአድቫንስ',
        notation: '',
        lyrics,
      });
    }
  }

  return songs;
}

const ALL_SONGS = buildSongs();

// ─── Category chip colors ──────────────────────────────────────────────────────
const CAT_COLORS = {
  'ንዑስ ትዝታ ቅኝት': '#7C3AED',
  'ባቲ ቅኝት':        '#1D4ED8',
  'አምባሰል ቅኝት':    '#065F46',
  'ግርፍ':           '#92400E',
  'ትዝታ':          '#B45309',
  'ሰላምታ':          '#0F766E',
  'ዝማሬ':           '#1C1917',
};
const catColor = (cat) => CAT_COLORS[cat] ?? '#1C1917';

// ─── Song Detail Modal ─────────────────────────────────────────────────────────
function SongDetailModal({ song, onClose }) {
  if (!song) return null;
  const color = catColor(song.category);

  return (
    <Modal visible animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <ImageBackground source={BG} style={{ flex: 1 }} resizeMode="cover" blurRadius={6}>
        <View style={{ flex: 1, backgroundColor: 'rgba(28,25,23,0.88)' }}>

          {/* Header */}
          <View style={det.header}>
            <TouchableOpacity onPress={onClose} style={det.backBtn}>
              <Text style={det.backTxt}>←</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={det.title} numberOfLines={2}>{song.title}</Text>
              {song.author ? <Text style={det.author}>{song.author}</Text> : null}
            </View>
          </View>

          {/* Category + level badges */}
          <View style={det.badges}>
            <View style={[det.badge, { backgroundColor: color + '30', borderColor: color }]}>
              <Text style={[det.badgeTxt, { color: '#FCD34D' }]}>{song.category}</Text>
            </View>
            <View style={[det.badge, { backgroundColor: '#1C1917', borderColor: '#FCD34D40' }]}>
              <Text style={[det.badgeTxt, { color: '#A8A29E' }]}>{song.level}</Text>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={det.body}
            showsVerticalScrollIndicator={false}
          >
            {/* Notation */}
            {song.notation ? (
              <View style={det.section}>
                <Text style={det.sectionLabel}>♩ ቅኝት / Notation</Text>
                <Text style={det.notationText}>{song.notation}</Text>
              </View>
            ) : null}

            {/* Lyrics */}
            {song.lyrics ? (
              <View style={det.section}>
                <Text style={det.sectionLabel}>📝 ግጥም / Lyrics</Text>
                <Text style={det.lyricsText}>{song.lyrics}</Text>
              </View>
            ) : null}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </ImageBackground>
    </Modal>
  );
}

const det = StyleSheet.create({
  header:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14 },
  backBtn:   { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(201,168,76,0.2)', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  backTxt:   { fontSize: 20, color: '#FCD34D', fontWeight: 'bold' },
  title:     { fontSize: 20, fontWeight: 'bold', color: '#FFF8E7', lineHeight: 26 },
  author:    { fontSize: 12, color: '#A8A29E', marginTop: 2 },
  badges:    { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 12, flexWrap: 'wrap' },
  badge:     { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, borderWidth: 1 },
  badgeTxt:  { fontSize: 12, fontWeight: '700' },
  body:      { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 60 },
  section:   { marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#C9A84C', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  notationText: { fontSize: 15, color: '#FFF8E7', lineHeight: 26, fontFamily: 'monospace' },
  lyricsText:   { fontSize: 15, color: '#FFF8E7', lineHeight: 28 },
});

// ─── Main Song Screen ──────────────────────────────────────────────────────────
export default function SongScreen() {
  const [level,    setLevel]    = useState('ለጀማሪ');
  const [category, setCategory] = useState('');
  const [search,   setSearch]   = useState('');
  const [selSong,  setSelSong]  = useState(null);

  // All unique categories for the selected level
  const categories = useMemo(() => {
    const cats = ALL_SONGS
      .filter(s => s.level === level)
      .map(s => s.category);
    return [...new Set(cats)];
  }, [level]);

  const displayed = useMemo(() => {
    let list = ALL_SONGS.filter(s => s.level === level);
    if (category) list = list.filter(s => s.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.lyrics.toLowerCase().includes(q)
      );
    }
    return list;
  }, [level, category, search]);

  return (
    <View style={styles.container}>

      {/* ── Level picker ── */}
      <View style={styles.levelBar}>
        {['ለጀማሪ', 'ለአድቫንስ'].map(lv => (
          <TouchableOpacity
            key={lv}
            style={[styles.levelBtn, level === lv && styles.levelBtnOn]}
            onPress={() => { setLevel(lv); setCategory(''); setSearch(''); }}
          >
            <Text style={[styles.levelTxt, level === lv && styles.levelTxtOn]}>{lv}</Text>
            <Text style={[styles.levelCount, level === lv && { color: '#FCD34D80' }]}>
              {ALL_SONGS.filter(s => s.level === lv).length}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Search ── */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="ዝማሬ ፈልግ…"
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: COLORS.textSecondary, fontSize: 16, paddingHorizontal: 8 }}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ── Category chips ── */}
      {categories.length > 1 && (
        <View style={{ height: 46 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 6, gap: 8, alignItems: 'center', height: 46 }}>
            <TouchableOpacity
              style={[styles.catChip, !category && styles.catChipOn]}
              onPress={() => setCategory('')}
            >
              <Text style={[styles.catTxt, !category && styles.catTxtOn]}>ሁሉም</Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, category === cat && styles.catChipOn,
                  category === cat && { borderColor: catColor(cat), backgroundColor: catColor(cat) + '20' }]}
                onPress={() => setCategory(cat === category ? '' : cat)}
              >
                <Text style={[styles.catTxt, category === cat && { color: '#FCD34D', fontWeight: '800' }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Count ── */}
      <Text style={styles.countTxt}>
        {displayed.length} ዝማሬ
      </Text>

      {/* ── Song list ── */}
      <FlatList
        data={displayed}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100, paddingTop: 4 }}
        renderItem={({ item }) => {
          const color = catColor(item.category);
          return (
            <TouchableOpacity
              style={styles.songCard}
              onPress={() => setSelSong(item)}
              activeOpacity={0.75}
            >
              {/* Color accent */}
              <View style={[styles.songAccent, { backgroundColor: color }]} />

              <View style={{ flex: 1, paddingLeft: 12 }}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 }}>
                  <Text style={[styles.songCat, { color }]}>{item.category}</Text>
                  {item.author ? (
                    <>
                      <Text style={{ color: COLORS.border }}>·</Text>
                      <Text style={styles.songAuthor} numberOfLines={1}>{item.author}</Text>
                    </>
                  ) : null}
                </View>
              </View>

              <Text style={styles.songArrow}>›</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🎵</Text>
            <Text style={{ color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold' }}>ዝማሬ አልተገኘም</Text>
            <Text style={{ color: COLORS.textSecondary, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>
              የፍለጋ ቃሉን ይቀይሩ
            </Text>
          </View>
        }
      />

      {selSong && (
        <SongDetailModal song={selSong} onClose={() => setSelSong(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Level bar
  levelBar:    { flexDirection: 'row', backgroundColor: '#1C1917', paddingVertical: 4, paddingHorizontal: 8 },
  levelBtn:    { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  levelBtnOn:  { backgroundColor: 'rgba(201,168,76,0.15)' },
  levelTxt:    { fontSize: 13, color: '#A8A29E', fontWeight: '600' },
  levelTxtOn:  { color: '#FCD34D', fontWeight: 'bold' },
  levelCount:  { fontSize: 11, color: '#A8A29E', fontWeight: '600' },

  // Search
  searchRow:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginVertical: 10,
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 12, height: 44 },
  searchIcon:  { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary, paddingVertical: 0 },

  // Category chips
  catChip:   { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#FFF' },
  catChipOn: { backgroundColor: '#1C1917', borderColor: '#1C1917' },
  catTxt:    { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  catTxtOn:  { color: '#FCD34D', fontWeight: 'bold' },

  // Count
  countTxt: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', paddingHorizontal: 14, paddingBottom: 4 },

  // Song card
  songCard:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden', elevation: 1, minHeight: 62 },
  songAccent: { width: 5, alignSelf: 'stretch', minHeight: 62 },
  songTitle:  { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  songCat:    { fontSize: 11, fontWeight: '700' },
  songAuthor: { fontSize: 11, color: COLORS.textSecondary, flex: 1 },
  songArrow:  { fontSize: 22, color: COLORS.textSecondary, paddingRight: 12 },
});
