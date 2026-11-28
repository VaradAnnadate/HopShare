import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Ride = {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  capacity: number;
  fare: number;
  distance: string;
  duration: string;
  driver: string;
  rating: string;
  car: string;
  color: string;
  note: string;
};

const sampleRides: Ride[] = [
  { id: '1', from: 'Koramangala', to: 'Indiranagar', date: 'Today', time: '6:15 PM', seats: 2, capacity: 3, fare: 255, distance: '8.2 km', duration: '25 min', driver: 'Aarav Mehta', rating: '4.9', car: 'Honda City · White', color: '#E9D7C5', note: 'Taking the inner ring road. Happy to make a quick pickup nearby.' },
  { id: '2', from: 'Koramangala', to: 'MG Road', date: 'Today', time: '6:30 PM', seats: 1, capacity: 2, fare: 220, distance: '9.6 km', duration: '30 min', driver: 'Riya Kapoor', rating: '5.0', car: 'Hyundai i20 · Blue', color: '#D9DDF0', note: 'Easygoing ride, with space for one passenger and a small bag.' },
  { id: '3', from: 'HSR Layout', to: 'Whitefield', date: 'Today', time: '7:00 PM', seats: 3, capacity: 4, fare: 580, distance: '18.4 km', duration: '45 min', driver: 'Kabir Shah', rating: '4.8', car: 'Tata Nexon · Green', color: '#D7E8DC', note: 'Heading east after work. Three seats available.' },
  { id: '4', from: 'Indiranagar', to: 'Koramangala', date: 'Tomorrow', time: '8:10 AM', seats: 2, capacity: 3, fare: 270, distance: '8.7 km', duration: '28 min', driver: 'Nisha Rao', rating: '4.9', car: 'Maruti Baleno · Silver', color: '#F1DDE1', note: 'Morning commute, leaving on time.' },
  { id: '5', from: 'Jayanagar', to: 'MG Road', date: 'Tomorrow', time: '9:00 AM', seats: 1, capacity: 2, fare: 210, distance: '7.9 km', duration: '24 min', driver: 'Dev Patel', rating: '4.7', car: 'Toyota Glanza · Red', color: '#EEDFCB', note: 'Can pick up close to the metro station.' },
];

const green = '#277456';
const ink = '#1B2B22';
const muted = '#7B8780';

function Field({ label, value, onChangeText, placeholder, marker }: {
  label: string; value: string; onChangeText: (value: string) => void; placeholder: string; marker: string;
}) {
  return (
    <View style={styles.field}>
      <View style={[styles.marker, { backgroundColor: marker }]} />
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A3ACA5"
          style={styles.input}
          returnKeyType="done"
          accessibilityLabel={label}
        />
      </View>
    </View>
  );
}

function RideCard({ ride, onPress }: { ride: Ride; onPress: () => void }) {
  const passengerShare = Math.ceil(ride.fare / ride.capacity);
  return (
    <Pressable style={styles.rideCard} onPress={onPress}>
      <View style={styles.rideTopline}>
        <View style={styles.timeBadge}><Text style={styles.timeBadgeText}>{ride.time}</Text></View>
        <Text style={styles.rideDate}>{ride.date}</Text>
      </View>
      <View style={styles.routeRow}>
        <View style={styles.routeMarkers}>
          <View style={[styles.marker, { backgroundColor: green }]} />
          <View style={styles.routeDashes} />
          <View style={[styles.marker, { backgroundColor: '#E49A68' }]} />
        </View>
        <View style={styles.routePlaces}>
          <Text style={styles.place}>{ride.from}</Text>
          <Text style={[styles.place, styles.destination]}>{ride.to}</Text>
        </View>
        <View style={styles.fareColumn}>
          <Text style={styles.fare}>₹{passengerShare}</Text>
          <Text style={styles.perPerson}>per person</Text>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <View style={[styles.avatar, { backgroundColor: ride.color }]}><Text style={styles.avatarText}>{ride.driver.split(' ').map((part) => part[0]).join('')}</Text></View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{ride.driver}</Text>
          <Text style={styles.driverMeta}>★ {ride.rating}  ·  {ride.seats} {ride.seats === 1 ? 'seat' : 'seats'} left</Text>
        </View>
        <Text style={styles.cardArrow}>›</Text>
      </View>
    </Pressable>
  );
}

export default function App() {
  const [rides, setRides] = useState(sampleRides);
  const [pickup, setPickup] = useState('Koramangala');
  const [destination, setDestination] = useState('');
  const [day, setDay] = useState<'Today' | 'Tomorrow'>('Today');
  const [seats, setSeats] = useState(1);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [activeMode, setActiveMode] = useState<'find' | 'offer'>('find');
  const [offerFrom, setOfferFrom] = useState('');
  const [offerTo, setOfferTo] = useState('');
  const [offerDate, setOfferDate] = useState<'Today' | 'Tomorrow'>('Today');
  const [offerTime, setOfferTime] = useState('6:00 PM');
  const [offerCapacity, setOfferCapacity] = useState('3');
  const [offerTotal, setOfferTotal] = useState('300');
  const [offerDriver, setOfferDriver] = useState('Samira');
  const [bookings, setBookings] = useState<Record<string, number>>({});
  const [showRequestConfirmation, setShowRequestConfirmation] = useState(false);

  const matches = useMemo(() => {
    const start = pickup.trim().toLowerCase();
    const end = destination.trim().toLowerCase();
    if (!searchSubmitted && !end) return rides.filter((ride) => ride.date === day && ride.seats >= seats);
    return rides.filter((ride) => {
      const fromMatches = !start || ride.from.toLowerCase().includes(start) || start.includes(ride.from.toLowerCase());
      const toMatches = !end || ride.to.toLowerCase().includes(end) || end.includes(ride.to.toLowerCase());
      return fromMatches && toMatches && ride.date === day && ride.seats >= seats;
    });
  }, [day, destination, pickup, seats, searchSubmitted, rides]);

  const selectedCurrentRide = selectedRide ? rides.find((ride) => ride.id === selectedRide.id) ?? selectedRide : null;
  const postRide = () => {
    const total = Number(offerTotal); const capacity = Number(offerCapacity);
    if (offerFrom.trim().length < 2 || offerTo.trim().length < 2) return Alert.alert('Add your route', 'Enter pickup and destination with at least 2 characters each.');
    if (offerFrom.trim().toLowerCase() === offerTo.trim().toLowerCase()) return Alert.alert('Check your route', 'Pickup and destination must be different.');
    if (!offerDriver.trim()) return Alert.alert('Add your name', 'Passengers need to know who is driving.');
    if (!offerTime.trim()) return Alert.alert('Add a departure time', 'Enter an approximate departure time.');
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 7) return Alert.alert('Check available seats', 'Choose between 1 and 7 passenger seats.');
    if (!Number.isInteger(total) || total < 1 || total > 100000) return Alert.alert('Check the total fare', 'Enter a whole number fare between ₹1 and ₹100,000.');
    const ride: Ride = { id: `posted-${Date.now()}`, from: offerFrom.trim(), to: offerTo.trim(), date: offerDate, time: offerTime.trim(), seats: capacity, capacity, fare: total, distance: 'Route estimate pending', duration: 'Time estimate pending', driver: offerDriver.trim(), rating: 'New', car: 'Vehicle details not added', color: '#D7E8DC', note: 'New ride posted by the driver.' };
    setRides((current) => [ride, ...current]); setPickup(ride.from); setDestination(ride.to); setDay(ride.date); setSeats(1); setSearchSubmitted(true); setActiveMode('find'); Keyboard.dismiss();
    Alert.alert('Ride posted', `Your ride is listed. Estimated share: ₹${Math.ceil(total / capacity)} per passenger.`);
  };
  const requestSeat = () => {
    if (!selectedCurrentRide || selectedCurrentRide.seats < 1) return;
    setRides((current) => current.map((ride) => ride.id === selectedCurrentRide.id ? { ...ride, seats: ride.seats - 1 } : ride));
    setBookings((current) => ({ ...current, [selectedCurrentRide.id]: (current[selectedCurrentRide.id] ?? 0) + 1 })); setShowRequestConfirmation(true);
  };
  const closeRequestConfirmation = () => { setShowRequestConfirmation(false); setSelectedRide(null); };

  const search = () => {
    Keyboard.dismiss();
    setSearchSubmitted(true);
  };

  if (selectedCurrentRide) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.detailPage}>
          <Pressable style={styles.backButton} onPress={() => setSelectedRide(null)}><Text style={styles.backText}>‹  Back to rides</Text></Pressable>
          <Text style={styles.detailEyebrow}>RIDE DETAILS</Text>
          <Text style={styles.detailTitle}>{selectedCurrentRide.from} to {selectedCurrentRide.to}</Text>
          <Text style={styles.detailSubtitle}>{selectedCurrentRide.date} · {selectedCurrentRide.time}</Text>
          <View style={styles.mapCard}>
            <View style={styles.mapCircleOne} /><View style={styles.mapCircleTwo} />
            <View style={styles.mapRoute}><View style={styles.mapStart} /><View style={styles.mapEnd} /></View>
            <Text style={styles.mapLabelStart}>{selectedCurrentRide.from}</Text><Text style={styles.mapLabelEnd}>{selectedCurrentRide.to}</Text>
            <Text style={styles.mapPlaceholder}>ROUTE PREVIEW</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoHeading}>Your trip</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Distance</Text><Text style={styles.infoValue}>{selectedCurrentRide.distance}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Estimated time</Text><Text style={styles.infoValue}>{selectedCurrentRide.duration}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Seats available</Text><Text style={styles.infoValue}>{selectedCurrentRide.seats}</Text></View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Total ride fare</Text><Text style={styles.infoValue}>₹{selectedCurrentRide.fare}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Split across seats</Text><Text style={styles.infoValue}>{selectedCurrentRide.capacity} passengers</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Your share</Text><Text style={styles.detailFare}>₹{Math.ceil(selectedCurrentRide.fare / selectedCurrentRide.capacity)}</Text></View>
            <Text style={styles.splitNote}>Total ride fare · estimated share per passenger</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoHeading}>Meet your driver</Text>
            <View style={styles.driverProfile}>
              <View style={[styles.largeAvatar, { backgroundColor: selectedCurrentRide.color }]}><Text style={styles.largeAvatarText}>{selectedCurrentRide.driver.split(' ').map((part) => part[0]).join('')}</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.driverName}>{selectedCurrentRide.driver}</Text><Text style={styles.driverMeta}>★ {selectedCurrentRide.rating} · 12 shared trips</Text></View>
            </View>
            <Text style={styles.carText}>{selectedCurrentRide.car}</Text>
            <Text style={styles.noteText}>{selectedCurrentRide.note}</Text>
          </View>
          <Pressable disabled={selectedCurrentRide.seats < 1} style={[styles.requestButton, selectedCurrentRide.seats < 1 && styles.disabledButton]} onPress={requestSeat}><Text style={styles.requestButtonText}>{selectedCurrentRide.seats < 1 ? 'Ride full' : `Request a seat · ₹${Math.ceil(selectedCurrentRide.fare / selectedCurrentRide.capacity)}`}</Text></Pressable>
          <Text style={styles.demoNote}>{bookings[selectedCurrentRide.id] ? `You requested ${bookings[selectedCurrentRide.id]} seat(s) · demo only` : 'Demo booking · no payment or driver notification'}</Text>
        </ScrollView>
        <Modal transparent visible={showRequestConfirmation} animationType="fade" onRequestClose={closeRequestConfirmation}><View style={styles.modalBackdrop}><View style={styles.modalCard}><Text style={styles.successMark}>✓</Text><Text style={styles.modalTitle}>Seat requested</Text><Text style={styles.modalMessage}>Your request is saved in this demo. {selectedCurrentRide.seats - 1} seat(s) remain.</Text><Pressable style={styles.requestButton} onPress={closeRequestConfirmation}><Text style={styles.requestButtonText}>Done</Text></Pressable></View></View></Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View><Text style={styles.brand}>hopshare<Text style={styles.brandDot}>.</Text></Text><Text style={styles.headerSub}>Find a better way there.</Text></View>
          <View style={styles.headerIcon}><Text style={styles.headerIconText}>↗</Text></View>
        </View>
        <View style={styles.intro}><Text style={styles.eyebrow}>{activeMode === 'find' ? 'SHARE THE ROAD' : 'DRIVE TOGETHER'}</Text><Text style={styles.title}>{activeMode === 'find' ? 'Where to today?' : 'Offer a ride'}</Text><Text style={styles.subtitle}>{activeMode === 'find' ? 'Find a ride and split the fare.' : 'Share your route and split the cost.'}</Text></View>
        <View style={styles.modeSwitch}><Pressable onPress={() => setActiveMode('find')} style={[styles.modeButton, activeMode === 'find' && styles.modeButtonActive]}><Text style={[styles.modeText, activeMode === 'find' && styles.modeTextActive]}>Find a ride</Text></Pressable><Pressable onPress={() => setActiveMode('offer')} style={[styles.modeButton, activeMode === 'offer' && styles.modeButtonActive]}><Text style={[styles.modeText, activeMode === 'offer' && styles.modeTextActive]}>Offer a ride</Text></Pressable></View>
        {activeMode === 'offer' ? <View style={styles.offerCard}>
          <Text style={styles.formHeading}>Your trip details</Text>
          <Field label="PICKUP" value={offerFrom} onChangeText={setOfferFrom} placeholder="e.g. Koramangala" marker={green} /><View style={styles.fieldConnector} />
          <Field label="DESTINATION" value={offerTo} onChangeText={setOfferTo} placeholder="e.g. Indiranagar" marker="#E49A68" />
          <Text style={styles.formLabel}>TRAVEL DAY</Text><View style={styles.dayControl}>{(['Today', 'Tomorrow'] as const).map((option) => <Pressable key={option} onPress={() => setOfferDate(option)} style={[styles.dayOption, offerDate === option && styles.dayOptionActive]}><Text style={[styles.dayText, offerDate === option && styles.dayTextActive]}>{option}</Text></Pressable>)}</View>
          <FormInput label="DEPARTURE TIME" value={offerTime} onChangeText={setOfferTime} placeholder="e.g. 6:30 PM" keyboardType="default" />
          <FormInput label="YOUR NAME" value={offerDriver} onChangeText={setOfferDriver} placeholder="Name passengers will see" keyboardType="default" />
          <FormInput label="AVAILABLE PASSENGER SEATS (1–7)" value={offerCapacity} onChangeText={setOfferCapacity} placeholder="3" keyboardType="number-pad" />
          <FormInput label="TOTAL TRIP FARE (₹)" value={offerTotal} onChangeText={setOfferTotal} placeholder="300" keyboardType="number-pad" />
          <Text style={styles.fareHint}>Estimated share: ₹{Math.ceil((Number(offerTotal) || 0) / Math.max(1, Number(offerCapacity) || 1))} per passenger</Text>
          <Pressable style={styles.searchButton} onPress={postRide}><Text style={styles.searchButtonText}>Post ride  →</Text></Pressable>
        </View> : <>
        <View style={styles.searchCard}>
          <Field label="PICKUP" value={pickup} onChangeText={(value) => { setPickup(value); setSearchSubmitted(false); }} placeholder="Enter pickup area" marker={green} />
          <View style={styles.fieldConnector} />
          <Field label="DESTINATION" value={destination} onChangeText={(value) => { setDestination(value); setSearchSubmitted(false); }} placeholder="Where are you going?" marker="#E49A68" />
          <View style={styles.controlsRow}>
            <View style={styles.dayControl}>
              {(['Today', 'Tomorrow'] as const).map((option) => <Pressable key={option} onPress={() => { setDay(option); setSearchSubmitted(false); }} style={[styles.dayOption, day === option && styles.dayOptionActive]}><Text style={[styles.dayText, day === option && styles.dayTextActive]}>{option}</Text></Pressable>)}
            </View>
            <View style={styles.seatControl}>
              <Pressable onPress={() => { setSeats(Math.max(1, seats - 1)); setSearchSubmitted(false); }} style={styles.seatButton} accessibilityLabel="Decrease seats"><Text style={styles.seatButtonText}>−</Text></Pressable>
              <Text style={styles.seatCount}>{seats} {seats === 1 ? 'seat' : 'seats'}</Text>
              <Pressable onPress={() => { setSeats(Math.min(4, seats + 1)); setSearchSubmitted(false); }} style={styles.seatButton} accessibilityLabel="Increase seats"><Text style={styles.seatButtonText}>+</Text></Pressable>
            </View>
          </View>
          <Pressable style={styles.searchButton} onPress={search}><Text style={styles.searchButtonText}>Find rides  →</Text></Pressable>
        </View>
        <View style={styles.resultsHeader}>
          <View><Text style={styles.resultsTitle}>{searchSubmitted ? 'Matching rides' : 'Rides you might like'}</Text><Text style={styles.resultsSubtitle}>{matches.length} {matches.length === 1 ? 'ride' : 'rides'} · {day} · at least {seats} {seats === 1 ? 'seat' : 'seats'}</Text></View>
          <Text style={styles.filterIcon}>☷</Text>
        </View>
        {matches.length ? matches.map((ride) => <RideCard key={ride.id} ride={ride} onPress={() => setSelectedRide(ride)} />) : (
          <View style={styles.emptyState}><Text style={styles.emptyIcon}>⌕</Text><Text style={styles.emptyTitle}>No rides found yet</Text><Text style={styles.emptyText}>Try another pickup or destination, or choose a different day.</Text><Pressable onPress={() => { setPickup(''); setDestination(''); setDay('Today'); setSeats(1); setSearchSubmitted(false); }}><Text style={styles.clearSearch}>Clear search</Text></Pressable></View>
        )}
        </>}
        <Text style={styles.footer}>Good trips are better shared. <Text style={styles.footerSpark}>✳</Text></Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F8F4' },
  page: { paddingHorizontal: 21, paddingTop: 12, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 27 },
  brand: { color: ink, fontSize: 23, fontWeight: '800', letterSpacing: -1 },
  brandDot: { color: '#E49A68' },
  headerSub: { color: muted, fontSize: 10, marginTop: 2 },
  headerIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#E8F0E9', alignItems: 'center', justifyContent: 'center' },
  headerIconText: { color: green, fontSize: 19, fontWeight: '600' },
  intro: { marginBottom: 17 },
  eyebrow: { color: green, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: ink, fontSize: 29, fontWeight: '750', letterSpacing: -1, marginTop: 6 },
  subtitle: { color: muted, fontSize: 12, marginTop: 4 },
  searchCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 15, borderWidth: 1, borderColor: '#E9EEE8', shadowColor: '#20382A', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  modeSwitch: { flexDirection: 'row', backgroundColor: '#E9EEE8', borderRadius: 11, padding: 3, marginBottom: 14 },
  modeButton: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 34, borderRadius: 8 },
  modeButtonActive: { backgroundColor: '#FFFFFF' },
  modeText: { color: '#839087', fontSize: 10, fontWeight: '600' },
  modeTextActive: { color: green },
  offerCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 15, borderWidth: 1, borderColor: '#E9EEE8' },
  formHeading: { color: ink, fontSize: 14, fontWeight: '700', marginBottom: 7 },
  formLabel: { color: '#929C95', fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 14, marginBottom: 7 },
  formInputWrap: { marginTop: 14 },
  formInput: { color: '#35433A', fontSize: 12, paddingHorizontal: 11, height: 40, backgroundColor: '#F7F8F5', borderRadius: 9, marginTop: 6 },
  fareHint: { color: green, fontSize: 10, fontWeight: '600', marginTop: 10, marginBottom: 13 },
  field: { flexDirection: 'row', alignItems: 'center', minHeight: 54, gap: 12 },
  marker: { width: 9, height: 9, borderRadius: 5 },
  fieldContent: { flex: 1, justifyContent: 'center' },
  fieldLabel: { color: '#929C95', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  input: { padding: 0, marginTop: 4, color: '#35433A', fontSize: 13, fontWeight: '600' },
  fieldConnector: { height: 1, backgroundColor: '#EEF1EC', marginLeft: 21 },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 12 },
  dayControl: { flexDirection: 'row', backgroundColor: '#F2F5F1', borderRadius: 9, padding: 3 },
  dayOption: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 7 },
  dayOptionActive: { backgroundColor: '#FFFFFF', shadowColor: '#23392B', shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 },
  dayText: { color: '#87918A', fontSize: 10, fontWeight: '600' },
  dayTextActive: { color: green },
  seatControl: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  seatButton: { width: 27, height: 27, borderRadius: 8, backgroundColor: '#F0F4F0', alignItems: 'center', justifyContent: 'center' },
  seatButtonText: { color: green, fontSize: 17, lineHeight: 20, fontWeight: '500' },
  seatCount: { color: '#536158', fontSize: 10, fontWeight: '600', minWidth: 39, textAlign: 'center' },
  searchButton: { height: 43, backgroundColor: green, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  searchButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, marginBottom: 13 },
  resultsTitle: { color: ink, fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  resultsSubtitle: { color: muted, fontSize: 9, marginTop: 4 },
  filterIcon: { color: green, fontSize: 20 },
  rideCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#ECF0EA' },
  rideTopline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timeBadge: { backgroundColor: '#EAF3ED', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6 },
  timeBadgeText: { color: green, fontSize: 9, fontWeight: '700' },
  rideDate: { color: muted, fontSize: 9, fontWeight: '600' },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  routeMarkers: { width: 13, height: 42, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  routeDashes: { height: 16, borderLeftWidth: 1, borderStyle: 'dashed', borderColor: '#C9D2CB' },
  routePlaces: { marginLeft: 9, gap: 10, flex: 1 },
  place: { color: '#35433A', fontSize: 11, fontWeight: '600' },
  destination: { color: '#68756D' },
  fareColumn: { alignItems: 'flex-end' },
  fare: { color: ink, fontSize: 17, fontWeight: '750' },
  perPerson: { color: '#929C95', fontSize: 8, marginTop: 1 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#F0F2EE', marginTop: 12, paddingTop: 11 },
  avatar: { width: 31, height: 31, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#4F5D53', fontSize: 9, fontWeight: '700' },
  driverInfo: { marginLeft: 8, flex: 1 },
  driverName: { color: '#35433A', fontSize: 10, fontWeight: '700' },
  driverMeta: { color: '#89938C', fontSize: 9, marginTop: 3 },
  cardArrow: { color: '#8A9A8F', fontSize: 23, marginRight: 3 },
  emptyState: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 17, padding: 24, borderWidth: 1, borderColor: '#ECF0EA' },
  emptyIcon: { color: '#88A591', fontSize: 27 },
  emptyTitle: { color: ink, fontSize: 14, fontWeight: '700', marginTop: 8 },
  emptyText: { color: muted, fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 5, maxWidth: 230 },
  clearSearch: { color: green, fontSize: 10, fontWeight: '700', marginTop: 13 },
  footer: { color: '#9AA39C', fontSize: 9, textAlign: 'center', marginTop: 18 },
  footerSpark: { color: '#80A28B' },
  detailPage: { paddingHorizontal: 21, paddingTop: 12, paddingBottom: 32 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 9, paddingRight: 10 },
  backText: { color: green, fontSize: 11, fontWeight: '700' },
  detailEyebrow: { color: green, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginTop: 18 },
  detailTitle: { color: ink, fontSize: 25, lineHeight: 31, fontWeight: '750', letterSpacing: -0.8, marginTop: 6 },
  detailSubtitle: { color: muted, fontSize: 11, marginTop: 4, marginBottom: 16 },
  mapCard: { height: 178, backgroundColor: '#E5EEE5', borderRadius: 18, overflow: 'hidden', marginBottom: 13, justifyContent: 'center' },
  mapCircleOne: { position: 'absolute', width: 210, height: 210, borderRadius: 110, borderWidth: 1, borderColor: '#D2E2D3', left: -50, top: -90 },
  mapCircleTwo: { position: 'absolute', width: 230, height: 230, borderRadius: 120, borderWidth: 1, borderColor: '#D2E2D3', right: -60, bottom: -150 },
  mapRoute: { position: 'absolute', left: '22%', right: '22%', top: '48%', height: 3, backgroundColor: '#7AA58A', transform: [{ rotate: '-17deg' }] },
  mapStart: { position: 'absolute', left: -4, top: -4, width: 11, height: 11, borderRadius: 7, backgroundColor: green, borderWidth: 2, borderColor: '#FFFFFF' },
  mapEnd: { position: 'absolute', right: -4, top: -4, width: 11, height: 11, borderRadius: 7, backgroundColor: '#E49A68', borderWidth: 2, borderColor: '#FFFFFF' },
  mapLabelStart: { position: 'absolute', left: 13, bottom: 29, color: '#53695A', fontSize: 9, fontWeight: '700' },
  mapLabelEnd: { position: 'absolute', right: 13, top: 31, color: '#53695A', fontSize: 9, fontWeight: '700' },
  mapPlaceholder: { position: 'absolute', right: 12, bottom: 10, color: '#90A394', fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: '#ECF0EA', marginBottom: 11 },
  infoHeading: { color: ink, fontSize: 13, fontWeight: '700', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 },
  infoLabel: { color: muted, fontSize: 10 },
  infoValue: { color: '#425047', fontSize: 10, fontWeight: '600' },
  infoDivider: { height: 1, backgroundColor: '#EFF2EE', marginVertical: 8 },
  detailFare: { color: green, fontSize: 17, fontWeight: '750' },
  splitNote: { color: '#9AA39C', fontSize: 8, textAlign: 'right', marginTop: -1 },
  driverProfile: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  largeAvatar: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  largeAvatarText: { color: '#4F5D53', fontSize: 12, fontWeight: '700' },
  carText: { color: '#56635A', fontSize: 10, fontWeight: '600', marginTop: 13 },
  noteText: { color: muted, fontSize: 10, lineHeight: 15, marginTop: 7 },
  requestButton: { height: 46, backgroundColor: green, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  disabledButton: { backgroundColor: '#AAB4AD' },
  requestButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  demoNote: { color: '#9AA39C', fontSize: 8, textAlign: 'center', marginTop: 9 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(20,35,26,0.38)', alignItems: 'center', justifyContent: 'center', padding: 26 },
  modalCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 21, alignItems: 'center' },
  successMark: { width: 43, height: 43, borderRadius: 15, overflow: 'hidden', textAlign: 'center', textAlignVertical: 'center', color: green, backgroundColor: '#EAF3ED', fontSize: 22, fontWeight: '700' },
  modalTitle: { color: ink, fontSize: 17, fontWeight: '700', marginTop: 13 },
  modalMessage: { color: muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginVertical: 9 },
});

function FormInput({ label, value, onChangeText, placeholder, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType: 'default' | 'number-pad' }) {
  return <View style={styles.formInputWrap}><Text style={styles.fieldLabel}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#A3ACA5" keyboardType={keyboardType} style={styles.formInput} /></View>;
}
