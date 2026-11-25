import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Ride = {
  id: string;
  from: string;
  to: string;
  time: string;
  seats: number;
  fare: number;
  name: string;
  initials: string;
  color: string;
  rating: string;
  tag?: string;
};

const rides: Ride[] = [
  {
    id: '1',
    from: 'Koramangala',
    to: 'Indiranagar',
    time: 'Today, 6:15 PM',
    seats: 2,
    fare: 85,
    name: 'Aarav Mehta',
    initials: 'AM',
    color: '#E7D5C3',
    rating: '4.9',
    tag: 'Going your way',
  },
  {
    id: '2',
    from: 'HSR Layout',
    to: 'MG Road',
    time: 'Today, 6:30 PM',
    seats: 1,
    fare: 110,
    name: 'Riya Kapoor',
    initials: 'RK',
    color: '#D8DDF0',
    rating: '5.0',
  },
  {
    id: '3',
    from: 'Jayanagar',
    to: 'Whitefield',
    time: 'Today, 7:00 PM',
    seats: 3,
    fare: 145,
    name: 'Kabir Shah',
    initials: 'KS',
    color: '#D4E7DB',
    rating: '4.8',
  },
];

const ink = '#192821';
const muted = '#79847E';
const green = '#277456';

function RoutePin({ color }: { color: string }) {
  return <View style={[styles.routePin, { backgroundColor: color }]} />;
}

function RideCard({ ride, onJoin }: { ride: Ride; onJoin: (ride: Ride) => void }) {
  return (
    <View style={styles.rideCard}>
      <View style={styles.cardTop}>
        {ride.tag ? <Text style={styles.tag}>{ride.tag}</Text> : <View />}
        <Text style={styles.time}>{ride.time}</Text>
      </View>
      <View style={styles.routeRow}>
        <View style={styles.routeLine}>
          <RoutePin color={green} />
          <View style={styles.routeDash} />
          <RoutePin color="#E29A65" />
        </View>
        <View style={styles.routeNames}>
          <Text style={styles.place}>{ride.from}</Text>
          <Text style={[styles.place, styles.destination]}>{ride.to}</Text>
        </View>
        <Text style={styles.fare}>₹{ride.fare}<Text style={styles.perPerson}> / person</Text></Text>
      </View>
      <View style={styles.cardDivider} />
      <View style={styles.cardFooter}>
        <View style={[styles.avatar, { backgroundColor: ride.color }]}>
          <Text style={styles.avatarText}>{ride.initials}</Text>
        </View>
        <View style={styles.driverDetails}>
          <Text style={styles.driverName}>{ride.name}</Text>
          <Text style={styles.driverMeta}>★ {ride.rating}  ·  {ride.seats} seats left</Text>
        </View>
        <Pressable style={styles.joinButton} onPress={() => onJoin(ride)}>
          <Text style={styles.joinText}>Join</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('Find a ride');
  const [joinedRides, setJoinedRides] = useState<string[]>([]);
  const matchedCount = useMemo(() => rides.length, []);

  const joinRide = (ride: Ride) => {
    if (joinedRides.includes(ride.id)) {
      Alert.alert('You’re on the list', `Your seat with ${ride.name} is requested.`);
      return;
    }
    setJoinedRides((current) => [...current, ride.id]);
    Alert.alert('Seat requested', `You’ve requested a seat with ${ride.name}.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.userName}>Samira <Text style={styles.wave}>✦</Text></Text>
          </View>
          <Pressable style={styles.profileButton} onPress={() => Alert.alert('Profile', 'Your HopShare profile is coming soon.')}>
            <Text style={styles.profileInitial}>S</Text>
            <View style={styles.onlineDot} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>YOUR CITY, TOGETHER</Text>
            <Text style={styles.heroTitle}>Good trips{ '\n' }are shared.</Text>
            <Text style={styles.heroSubtitle}>Find your people. Split the fare.</Text>
          </View>
          <View style={styles.heroArt}>
            <View style={styles.sun} />
            <View style={styles.artHillBack} />
            <View style={styles.artHillFront} />
            <View style={styles.road} />
            <View style={styles.carBody}><View style={styles.carWindow} /></View>
            <View style={[styles.wheel, { left: 20 }]} />
            <View style={[styles.wheel, { left: 72 }]} />
          </View>
          <View style={styles.heroSparkle}><Text style={styles.sparkleText}>✳</Text></View>
        </View>

        <View style={styles.searchCard}>
          <View style={styles.searchHeader}>
            <Text style={styles.sectionTitle}>Where are you headed?</Text>
            <Text style={styles.tinyIcon}>⌖</Text>
          </View>
          <View style={styles.searchFields}>
            <View style={styles.searchField}>
              <RoutePin color={green} />
              <Text style={styles.searchText}>Koramangala, Bengaluru</Text>
            </View>
            <View style={styles.fieldDivider} />
            <View style={styles.searchField}>
              <RoutePin color="#E29A65" />
              <Text style={styles.searchPlaceholder}>Add your destination</Text>
            </View>
          </View>
          <View style={styles.searchBottom}>
            <View style={styles.dateChip}><Text style={styles.chipIcon}>◷</Text><Text style={styles.chipText}>Today, 5–8 PM</Text></View>
            <View style={styles.dateChip}><Text style={styles.chipIcon}>♙</Text><Text style={styles.chipText}>1 seat</Text></View>
            <Pressable style={styles.searchButton} onPress={() => Alert.alert('Find a ride', 'Add a destination to see rides along your route.')}>
              <Text style={styles.searchButtonText}>→</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.savingsBanner}>
          <View style={styles.savingsIcon}><Text style={styles.savingsIconText}>↗</Text></View>
          <View style={styles.savingsCopy}>
            <Text style={styles.savingsTitle}>Your wallet says thanks</Text>
            <Text style={styles.savingsSubtitle}>You’ve saved ₹680 by sharing rides</Text>
          </View>
          <Text style={styles.savingsArrow}>›</Text>
        </View>

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionTitle}>Rides near you</Text><Text style={styles.sectionHint}>{matchedCount} rides matching your route</Text></View>
          <Pressable onPress={() => Alert.alert('All rides', 'You’re seeing the latest rides nearby.')}><Text style={styles.seeAll}>See all  ↗</Text></Pressable>
        </View>

        <View style={styles.tabs}>
          {['Find a ride', 'Offer a ride'].map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'Find a ride' ? (
          rides.map((ride) => <RideCard key={ride.id} ride={ride} onJoin={joinRide} />)
        ) : (
          <View style={styles.offerCard}>
            <Text style={styles.offerIcon}>＋</Text>
            <Text style={styles.offerTitle}>Share your next trip</Text>
            <Text style={styles.offerBody}>Offer empty seats and split your travel costs with people heading the same way.</Text>
            <Pressable style={styles.offerButton} onPress={() => Alert.alert('Offer a ride', 'Ride posting is coming soon.') }><Text style={styles.offerButtonText}>Post a ride  →</Text></Pressable>
          </View>
        )}

        <View style={styles.footerNote}><Text style={styles.footerLeaf}>✳</Text><Text style={styles.footerText}>Better together, one ride at a time.</Text></View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => setActiveTab('Find a ride')}><Text style={styles.navIconActive}>⌂</Text><Text style={styles.navTextActive}>Explore</Text></Pressable>
        <Pressable style={styles.navItem} onPress={() => Alert.alert('My rides', 'Your upcoming shared rides will show here.')}><Text style={styles.navIcon}>▣</Text><Text style={styles.navText}>My rides</Text></Pressable>
        <Pressable style={styles.navItem} onPress={() => Alert.alert('Messages', 'Ride chats will show here.')}><Text style={styles.navIcon}>◌</Text><Text style={styles.navText}>Messages</Text></Pressable>
        <Pressable style={styles.navItem} onPress={() => Alert.alert('Profile', 'Your HopShare profile is coming soon.')}><Text style={styles.navIcon}>♙</Text><Text style={styles.navText}>Profile</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8F4' },
  page: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { color: muted, fontSize: 13, fontWeight: '500', letterSpacing: 0.2 },
  userName: { color: ink, fontSize: 25, fontWeight: '700', marginTop: 2, letterSpacing: -0.7 },
  wave: { color: '#E4A569', fontSize: 19 },
  profileButton: { width: 43, height: 43, borderRadius: 22, backgroundColor: '#E9DED0', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  profileInitial: { fontSize: 16, color: '#6B503C', fontWeight: '700' },
  onlineDot: { position: 'absolute', right: -1, bottom: 0, width: 11, height: 11, borderRadius: 6, backgroundColor: '#5BA879', borderWidth: 2, borderColor: '#F7F8F4' },
  hero: { height: 184, borderRadius: 24, backgroundColor: '#DDEBE2', padding: 21, overflow: 'hidden', marginBottom: 17 },
  heroCopy: { zIndex: 2 },
  eyebrow: { color: green, fontSize: 9, fontWeight: '800', letterSpacing: 1.7 },
  heroTitle: { color: ink, fontSize: 31, lineHeight: 33, fontWeight: '700', letterSpacing: -1.1, marginTop: 8 },
  heroSubtitle: { color: '#536A5D', fontSize: 11, marginTop: 7, fontWeight: '500' },
  heroArt: { position: 'absolute', right: 0, bottom: 0, width: 164, height: 154 },
  sun: { position: 'absolute', width: 53, height: 53, borderRadius: 27, backgroundColor: '#F2C990', right: 24, top: 15 },
  artHillBack: { position: 'absolute', width: 160, height: 89, right: -35, bottom: 20, borderRadius: 75, backgroundColor: '#A8CBB1', transform: [{ rotate: '-23deg' }] },
  artHillFront: { position: 'absolute', width: 160, height: 61, right: -30, bottom: -4, borderRadius: 70, backgroundColor: '#7CAB8B', transform: [{ rotate: '-12deg' }] },
  road: { position: 'absolute', height: 27, width: 133, right: -23, bottom: -9, backgroundColor: '#F5F0E4', transform: [{ rotate: '-18deg' }] },
  carBody: { position: 'absolute', width: 82, height: 28, right: 23, bottom: 31, borderRadius: 14, backgroundColor: '#E68E62', transform: [{ rotate: '-8deg' }] },
  carWindow: { position: 'absolute', width: 40, height: 14, left: 23, top: -10, borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: '#F7E8CF', borderWidth: 2, borderColor: '#E68E62' },
  wheel: { position: 'absolute', width: 16, height: 16, bottom: 24, borderRadius: 9, borderWidth: 4, borderColor: '#334D40', backgroundColor: '#DDEBE2' },
  heroSparkle: { position: 'absolute', right: 16, top: 17 },
  sparkleText: { color: '#FFFFFF', fontSize: 19 },
  searchCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#EFF1EC', marginBottom: 13, shadowColor: '#24392D', shadowOpacity: 0.035, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  searchHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  sectionTitle: { color: ink, fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  tinyIcon: { color: green, fontSize: 20, fontWeight: '600' },
  searchFields: { borderRadius: 12, backgroundColor: '#F7F8F5', paddingHorizontal: 12, paddingVertical: 3 },
  searchField: { height: 39, flexDirection: 'row', alignItems: 'center', gap: 11 },
  routePin: { width: 8, height: 8, borderRadius: 5 },
  searchText: { color: '#39473F', fontSize: 12, fontWeight: '600' },
  searchPlaceholder: { color: '#939C96', fontSize: 12, fontWeight: '500' },
  fieldDivider: { height: 1, backgroundColor: '#E9ECE7', marginLeft: 19 },
  searchBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 7 },
  dateChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F5F0', borderRadius: 8, paddingHorizontal: 8, height: 29, gap: 5 },
  chipIcon: { color: green, fontSize: 13 },
  chipText: { color: '#55625A', fontSize: 10, fontWeight: '600' },
  searchButton: { marginLeft: 'auto', backgroundColor: green, width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  searchButtonText: { color: '#FFFFFF', fontSize: 21, lineHeight: 23, fontWeight: '500' },
  savingsBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0EEE4', borderRadius: 16, padding: 12, marginBottom: 23 },
  savingsIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#E1E5CD', alignItems: 'center', justifyContent: 'center' },
  savingsIconText: { color: green, fontSize: 19, fontWeight: '600' },
  savingsCopy: { marginLeft: 10, flex: 1 },
  savingsTitle: { color: '#303D34', fontSize: 11, fontWeight: '700' },
  savingsSubtitle: { color: '#7B8376', fontSize: 10, marginTop: 3 },
  savingsArrow: { color: '#748275', fontSize: 24, marginRight: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  sectionHint: { color: muted, fontSize: 10, marginTop: 4 },
  seeAll: { color: green, fontSize: 10, fontWeight: '700' },
  tabs: { flexDirection: 'row', backgroundColor: '#ECEFE9', borderRadius: 10, padding: 3, marginBottom: 13 },
  tab: { flex: 1, alignItems: 'center', borderRadius: 8, height: 32, justifyContent: 'center' },
  activeTab: { backgroundColor: '#FFFFFF', shadowColor: '#28382D', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  tabText: { color: '#838D86', fontSize: 11, fontWeight: '600' },
  activeTabText: { color: green },
  rideCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#EFF1EC', marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tag: { color: green, backgroundColor: '#EAF3ED', overflow: 'hidden', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 4, fontSize: 8, fontWeight: '700' },
  time: { color: muted, fontSize: 9, fontWeight: '600' },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  routeLine: { width: 13, height: 43, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  routeDash: { width: 1, height: 17, borderLeftWidth: 1, borderColor: '#CBD3CC', borderStyle: 'dashed' },
  routeNames: { marginLeft: 8, gap: 9, flex: 1 },
  place: { color: '#344239', fontSize: 11, fontWeight: '600' },
  destination: { color: '#657169' },
  fare: { color: ink, fontSize: 16, fontWeight: '700', letterSpacing: -0.4 },
  perPerson: { color: '#939B95', fontSize: 8, fontWeight: '500', letterSpacing: 0 },
  cardDivider: { height: 1, backgroundColor: '#F0F2EE', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#4C594F', fontSize: 9, fontWeight: '700' },
  driverDetails: { marginLeft: 8, flex: 1 },
  driverName: { color: '#37443B', fontSize: 10, fontWeight: '700' },
  driverMeta: { color: '#87918A', fontSize: 9, marginTop: 3 },
  joinButton: { paddingHorizontal: 16, height: 30, borderRadius: 9, backgroundColor: '#EAF3ED', alignItems: 'center', justifyContent: 'center' },
  joinText: { color: green, fontSize: 10, fontWeight: '700' },
  offerCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#EFF1EC' },
  offerIcon: { color: green, fontSize: 28, width: 48, height: 48, textAlign: 'center', textAlignVertical: 'center', borderRadius: 16, backgroundColor: '#EAF3ED', overflow: 'hidden' },
  offerTitle: { color: ink, fontSize: 15, fontWeight: '700', marginTop: 12 },
  offerBody: { color: muted, fontSize: 11, textAlign: 'center', lineHeight: 17, marginTop: 7, maxWidth: 250 },
  offerButton: { backgroundColor: green, borderRadius: 10, paddingHorizontal: 17, paddingVertical: 11, marginTop: 15 },
  offerButtonText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  footerNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 18 },
  footerLeaf: { color: '#8BA894', fontSize: 13 },
  footerText: { color: '#9AA39B', fontSize: 10 },
  bottomNav: { height: 63, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EFF1EC', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 56, gap: 3 },
  navIconActive: { color: green, fontSize: 20, lineHeight: 22 },
  navIcon: { color: '#9BA49D', fontSize: 18, lineHeight: 22 },
  navTextActive: { color: green, fontSize: 8, fontWeight: '700' },
  navText: { color: '#929C94', fontSize: 8, fontWeight: '600' },
});
