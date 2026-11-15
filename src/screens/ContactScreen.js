import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Linking, ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const BG = require('../../assets/back-2.jpg');

const CONTACTS = [
  {
    id:         'phone',
    label:      'ስልክ',
    value:      '0979 649 002',
    color:      '#16A34A',
    bgColor:    '#F0FDF4',
    borderColor:'#86EFAC',
    action:     () => Linking.openURL('tel:0979649002'),
    actionLabel:'ደውል',
    icon: (color) => <Feather name="phone-call" size={28} color={color} />,
  },
  {
    id:         'telegram',
    label:      'Telegram',
    value:      'ቡድናችን ይቀላቀሉ',
    color:      '#0088CC',
    bgColor:    '#EFF6FF',
    borderColor:'#93C5FD',
    action:     () => Linking.openURL('https://t.me/+fiN9c_bB-MA4Njk0'),
    actionLabel:'ይቀላቀሉ',
    icon: (color) => <FontAwesome5 name="telegram-plane" size={28} color={color} />,
  },
  {
    id:         'youtube',
    label:      'YouTube',
    value:      'ቻናላችን ይጎብኙ',
    color:      '#DC2626',
    bgColor:    '#FEF2F2',
    borderColor:'#FCA5A5',
    action:     () => Linking.openURL('https://youtube.com/@zenabegena63?si=bqUURegX9w7kNvR7'),
    actionLabel:'ይጎብኙ',
    icon: (color) => <FontAwesome5 name="youtube" size={28} color={color} />,
  },
];

export default function ContactScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ── */}
      <ImageBackground source={BG} style={styles.hero} resizeMode="cover">
        <LinearGradient
          colors={['rgba(28,25,23,0.2)', 'rgba(28,25,23,0.80)', '#1C1917']}
          style={styles.heroGrad}
        >
          <View style={styles.heroContent}>
            <MaterialCommunityIcons name="contacts" size={52} color="#FCD34D" style={{ marginBottom: 10 }} />
            <Text style={styles.heroTitle}>ያግኙን</Text>
            <Text style={styles.heroSub}>ዜና በገና — Contact Us</Text>
            <View style={styles.heroDivider} />
            <Text style={styles.heroTagline}>
              ለማንኛውም ጥያቄ እና መረጃ ያናግሩን
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* ── Contact cards ── */}
      {CONTACTS.map(c => (
        <TouchableOpacity
          key={c.id}
          style={[styles.card, { backgroundColor: c.bgColor, borderColor: c.borderColor }]}
          onPress={c.action}
          activeOpacity={0.8}
        >
          {/* Icon circle */}
          <View style={[styles.iconWrap, { backgroundColor: c.color + '18', borderColor: c.color + '40' }]}>
            {c.icon(c.color)}
          </View>

          {/* Text */}
          <View style={styles.cardBody}>
            <Text style={[styles.cardLabel, { color: c.color }]}>{c.label}</Text>
            <Text style={styles.cardValue}>{c.value}</Text>
          </View>

          {/* Action button */}
          <View style={[styles.actionBtn, { backgroundColor: c.color }]}>
            <Text style={styles.actionBtnTxt}>{c.actionLabel}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* ── Note ── */}
      <View style={styles.note}>
        <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#92400E" style={{ marginTop: 1 }} />
        <Text style={styles.noteText}>
          ለተጨማሪ ዝማሬዎች፣ ትምህርቶች እና ዜናዎች ቻናላችንን ይከተሉ።
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F4' },
  content:   { paddingBottom: 20 },

  // Hero
  hero:        { height: 260 },
  heroGrad:    { flex: 1, justifyContent: 'flex-end' },
  heroContent: { alignItems: 'center', paddingBottom: 28, paddingHorizontal: 24 },
  heroTitle:   { fontSize: 30, fontWeight: 'bold', color: '#FFF8E7', letterSpacing: 2, fontFamily: 'Nyala' },
  heroSub:     { fontSize: 13, color: '#A8A29E', marginTop: 4, letterSpacing: 0.5, fontFamily: 'Nyala' },
  heroDivider: { width: 60, height: 2, backgroundColor: '#C9A84C', marginVertical: 10 },
  heroTagline: { fontSize: 13, color: '#FCD34D', fontWeight: '600', textAlign: 'center', fontFamily: 'Nyala' },

  // Cards
  card: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 14,
    borderRadius: 18, padding: 16, borderWidth: 1.5,
    elevation: 2, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  iconWrap:     { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  cardBody:     { flex: 1 },
  cardLabel:    { fontSize: 16, fontWeight: '800', marginBottom: 2, fontFamily: 'Nyala' },
  cardValue:    { fontSize: 13, color: '#44403C', fontFamily: 'Nyala' },
  actionBtn:    { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  actionBtnTxt: { color: '#FFF', fontWeight: '700', fontSize: 13, fontFamily: 'Nyala' },

  // Note
  note: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    marginHorizontal: 16, marginTop: 20,
    backgroundColor: '#FEF9C3', borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: '#FDE68A',
  },
  noteText: { flex: 1, fontSize: 13, color: '#92400E', lineHeight: 20, fontFamily: 'Nyala' },
});
