import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Alert,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Linking
} from 'react-native';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';
import ReturnIcon from '../../assets/images/Group.svg'
import LocationIcon from '../../assets/images/location.svg';
import PhoneIcon from '../../assets/images/phone.svg';
import WebIcon from '../../assets/images/External_Link.svg';
import TimeIcon from '../../assets/images/time.svg';
import TabSelector from './TabSelector';
import PlusIcon from '../../assets/images/plus.svg';
import FlagIcon from '../../assets/images/flag.svg';
import { auth } from '../../firebase/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { on } from 'events';
import Labels from './Labels';
import CrowdednessSlider from './Crowdedness';
import CrowdednessGraph from './OccupancyGraph';
import MenuSlider from './MenuSlider';
import ItemSlider from './ItemSlider';

const menuPhotos = [
  require('../../assets/images/menu images/menu1.png'),
  require('../../assets/images/menu images/menu2.png'),
  require('../../assets/images/menu images/menu3.png'),
]

const itemPhotos = [
  require('../../assets/images/menu images/item1.png'),
  require('../../assets/images/menu images/item2.png'),
  require('../../assets/images/menu images/item3.png'),
]

const getOpenStatusWithTimes = (hoursMap: Record<string, string>) => {
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let dayIndex = now.getDay();
  let hour = now.getHours();
  let minute = now.getMinutes();
  const nowMinutes = hour * 60 + minute;

  const isLateNight = hour < 4;
  const effectiveDayIndex = isLateNight ? (dayIndex - 1 + 7) % 7 : dayIndex;
  const currentDay = daysOfWeek[effectiveDayIndex];

  const normalizedHoursMap = Object.fromEntries(
    Object.entries(hoursMap).map(([day, hours]) => [day.toLowerCase(), hours])
  );

  const todayHours = normalizedHoursMap[currentDay.toLowerCase()];

  if (!todayHours || typeof todayHours !== 'string' || todayHours.toLowerCase() === 'closed') {
    return findNextOpening(normalizedHoursMap, effectiveDayIndex, daysOfWeek); // <<<< pass normalized map
  }

  const normalizedTodayHours = todayHours.replace(/\u2013|\u2011/g, '-').replace(/\s+/g, ' ').trim();
  const [openTime, closeTime] = normalizedTodayHours.split('-').map(time => time.trim());

  const openMinutes = parseTimeToMinutes(openTime);
  const closeMinutes = parseTimeToMinutes(closeTime);

  let isOpenNow = false;
  if (closeMinutes > openMinutes) {
    isOpenNow = nowMinutes >= openMinutes && nowMinutes < closeMinutes;
  } else {
    isOpenNow = nowMinutes >= openMinutes || nowMinutes < closeMinutes;
  }

  if (isOpenNow) {
    return {
      statusParts: [
        { text: 'Open now', color: '#3C751E' },
        { text: ` until ${closeTime}`, color: '#000000' }
      ]
    };
  } else {
    return findNextOpening(normalizedHoursMap, effectiveDayIndex, daysOfWeek); // <<<< pass normalized map
  }
};

function findNextOpening(hoursMap: Record<string, string>, startDayIndex: number, daysOfWeek: string[]) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (let j = 0; j <= 7; j++) {
    const nextDayIndex = (startDayIndex + j) % 7;
    const nextDay = daysOfWeek[nextDayIndex];
    const nextDayHours = hoursMap[nextDay.toLowerCase()]; // use .toLowerCase()

    if (nextDayHours && typeof nextDayHours === 'string' && nextDayHours.toLowerCase() !== 'closed') {
      const normalizedHours = nextDayHours.replace(/\u2013|\u2011/g, '-').replace(/\s+/g, ' ').trim();
      const [nextOpenTime, nextCloseTime] = normalizedHours.split('-').map(time => time.trim());
      const openMinutes = parseTimeToMinutes(nextOpenTime);
      const closeMinutes = parseTimeToMinutes(nextCloseTime);

      if (j === 0) {
        if (nowMinutes < openMinutes) {
          return {
            statusParts: [
              { text: 'Closed now', color: '#E6725A' },
              { text: `, opens at ${nextOpenTime}`, color: '#000000' }
            ]
          };
        }
        // else skip today
      } else {
        return {
          statusParts: [
            { text: 'Closed now', color: '#E6725A' },
            { text: `, opens at ${nextOpenTime} on ${nextDay}`, color: '#000000' }
          ]
        };
      }
    }
  }

  return {
    statusParts: [
      { text: 'Closed for the week', color: '#E6725A' }
    ]
  };
}

function parseTimeToMinutes(timeStr: string): number {
  const [time, period] = timeStr.split(' ');
  let [hour, minute] = time.split(':').map(Number);
  if (minute === undefined) minute = 0;
  if (period.toLowerCase() === 'pm' && hour !== 12) {
    hour += 12;
  }
  if (period.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }
  return hour * 60 + minute;
}

function getTodayOpenHours(hoursMap: Record<string, string>) {
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = now.getDay();
  const currentDay = daysOfWeek[dayIndex];

  const todayHours = hoursMap[currentDay];

  if (!todayHours || typeof todayHours !== 'string' || todayHours.toLowerCase() === 'closed') {
    return null; // Closed today or no data
  }

  // Only normalize dashes
  const normalizedTodayHours = todayHours.replace(/\u2013|\u2011/g, '-'); // normalize en dash or non-breaking hyphen

  // Show split before mapping
  const splitResult = normalizedTodayHours.split(/\s*-\s*/);

  if (splitResult.length !== 2) {
    console.error('Bad split format — not 2 parts!');
    return null;
  }

  const [openTime, closeTime] = splitResult.map(time => time.trim());

  return {
    earliest: openTime,
    latest: closeTime
  };
}

function getCurrentOccupancy(
  crowdednessMap: Record<string, Record<string, { crowdedness: number | string }>>,
  time: Date
): number {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = daysOfWeek[time.getDay()];

  const todayMap = crowdednessMap[currentDay];
  if (!todayMap) {
    return 0; // No data for today
  }

  // Check if todayMap has any `:30` keys
  const hasHalfHourSlots = Object.keys(todayMap).some((key) => key.includes(':30'));

  const hour = time.getHours();
  const minute = time.getMinutes();

  const hourIn12Format = hour % 12 === 0 ? 12 : hour % 12;
  const amPm = hour >= 12 ? 'pm' : 'am';

  let key: string;

  if (hasHalfHourSlots) {
    // Use :30 if minutes >= 30
    key = minute < 30 ? `${hourIn12Format}${amPm}` : `${hourIn12Format}:30${amPm}`;
  } else {
    // Only full hours available
    key = `${hourIn12Format}${amPm}`;
  }

  const hourEntry = todayMap[key];

  if (!hourEntry) {
    return 0;
  }

  const crowdednessValue = hourEntry.crowdedness;

  // If it's a string like "40%", remove the percent sign
  if (typeof crowdednessValue === 'string') {
    const numberOnly = parseFloat(crowdednessValue.replace('%', '').trim());
    return isNaN(numberOnly) ? 0 : numberOnly;
  }

  // If it's already a number
  return crowdednessValue;
}

const getRelativeTime = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  for (let i = 0; i < intervals.length; i++) {
    const { label, seconds } = intervals[i];
    const intervalCount = Math.floor(diffInSeconds / seconds);
    if (intervalCount >= 1) {
      return `${intervalCount} ${label}${intervalCount > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

const ReviewScreen = ({ cafeID, goBack }: { cafeID: string, goBack: () => void }) => {
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [goodLabels, setGoodLabels] = useState<Record<string, number>>({});
  const [badLabels, setBadLabels] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [cafe, setCafe] = useState<any>(null);

  const [openStatus, setOpenStatus] = useState<{ statusParts: { text: string; color: string }[] }>({
    statusParts: []
  });

  const [openHours, setOpenHours] = useState<{ earliest: string; latest: string } | null>(null);
  const [crowdedness, setCrowdedness] = useState<number | null>(null);

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email, uid: user.uid, displayName: user.displayName, photoURL: user.photoURL });
      } else {
        setUser({ email: null, uid: null, displayName: null, photoURL: null });
      }
    })
  }, []);

  const [activeTab, setActiveTab] = useState<'Menu' | 'Info' | 'Reviews'>('Reviews');

  const [tabLayouts, setTabLayouts] = useState<{ [key in 'Menu' | 'Info' | 'Reviews']?: { x: number; width: number } }>({});

  const fetchCafeInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cafes/getByID/${cafeID}`);
      const data = await response.json();
      setCafe(data);
      const status = getOpenStatusWithTimes(data.hours);
      setOpenStatus(status);
      const todayOpenHours = getTodayOpenHours(data.hours);
      setOpenHours(todayOpenHours);
      const currentOccupancy = getCurrentOccupancy(data.occupancy, new Date());
      setCrowdedness(currentOccupancy);

    } catch (error) {
      console.error('Error fetching cafe info:', error);
      Alert.alert('Error', 'There was a problem fetching cafe information.');
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/review/getAllbyCafe/${cafeID}`);
      const data = await response.json();
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Error', 'There was a problem fetching reviews.');
    } finally {
      setLoading(false);
    }
  };

  interface LabelEntry {
    count: number
  }

  const fetchLabels = async () => {
    const [goodLabels, badLabels] = await Promise.all([
      fetch(`http://localhost:3000/cafes/getGoodLabelsByID/${cafeID}`),
      fetch(`http://localhost:3000/cafes/getBadLabelsByID/${cafeID}`)
    ])

    const goodData: Record<string, number> = await goodLabels.json();
    const badData: Record<string, number> = await badLabels.json();

    const filteredGood: Record<string, number> = {};
    const filteredBad: Record<string, number> = {};

    for (const [key, value] of Object.entries(goodData)) {
      if (value > 0) {
        filteredGood[key] = value
      }
    }

    for (const [key, value] of Object.entries(badData)) {
      if (value > 0) {
        filteredBad[key] = value
      }
    }

    const labelPairs: [string, string][] = [
      ["Good Music", "Loud Music"],
      ["Comfy Seats", "Bad Seating"],
      ["Free Wifi", "No Wifi"],
      ["Outlets", "No Outlets"],
      ["Good Service", "Bad Service"]
    ];

    for (const [goodLabel, badLabel] of labelPairs) {
      const goodCount = filteredGood[goodLabel] || 0
      const badCount = filteredBad[badLabel] || 0

      if (badCount > goodCount) {
        delete filteredGood[goodLabel]
      } else {
        delete filteredBad[badLabel]
      }
    }

    setGoodLabels(filteredGood)
    setBadLabels(filteredBad)
  }
  useEffect(() => {
    fetchCafeInfo();
    fetchReviews();
    fetchLabels();
  }, []);

  const submitReview = async (
    overall: number,
    drinkQuality: number,
    vibe: number,
    ammenities: number,
    cafeComments: string,
    selectedLabels: string[],
    drinkReccomendations: string,
    coffee: number,
    matcha: number,
    tea: number,
    specialty: number
  ) => {
    const reviewData = {
      user: user?.displayName || 'user123',     // Replace with real user ID if available
      userID: user?.uid || 'user123', // Use user ID from auth state
      postID: 'post123',     // Generate or assign postID appropriately
      cafeID,
      overall,
      drinkQuality,
      vibe,
      ammenities,
      cafeComments,
      selectedLabels,
      drinkReccomendations,
      coffee,
      matcha,
      tea,
      specialty,
      date: new Date().toISOString(),
    };


    try {
      const response = await fetch('http://localhost:3000/review/postReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        Alert.alert('Thank you! Your review has been submitted.');
        fetchReviews();  // Refresh reviews after submission
        fetchCafeInfo();
      } else {
        Alert.alert('Error', 'There was a problem submitting your review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error submitting review.');
    } finally {
      setShowForm(false);
    }

  };

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };


  if (showForm) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <ReviewForm onSubmit={submitReview} onCancel={() => setShowForm(false)} cafeName={cafe.name} />
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {cafe && (
          <>
            <View style={styles.headerContainer}>
              <Pressable onPress={goBack} style={styles.backButton}>
                <ReturnIcon width={24} height={24} />
              </Pressable>

              <View style={styles.rightIconsContainer}>
                <Pressable style={styles.iconButton}>
                  <PlusIcon width={24} height={24} />
                </Pressable>
                <Pressable style={styles.iconButton}>
                  <FlagIcon width={24} height={24} />
                </Pressable>
              </View>
            </View>

            <View style={styles.imageAndInfoContainer}>
              <View style={styles.roundedImageWrapper}>
                <Image
                  source={require('../../assets/images/template.png')}
                  style={styles.reviewImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.cafeInfo}>
                <View style={styles.cafeHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.cafeName} numberOfLines={1} adjustsFontSizeToFit={true}>
                      {cafe.name}
                    </Text>
                  </View>
                </View>
                <View style={styles.rating}>
                  <StarRating rating={parseFloat(cafe.ratings['overall']['rating']) || 0} size={20} readOnly />
                </View>
                <Text style={styles.cafeAddress}>
                  {`$ | ${openHours ? `Open from ${openHours.earliest} to ${openHours.latest}` : 'No hours available'}`}
                </Text>
              </View>
            </View>
          </>
        )}
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'Info' && cafe && (
          <View style={{ width: '100%', position: 'relative' }}>
            <View>
              {tabLayouts[activeTab] && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: tabLayouts[activeTab].x,
                    width: tabLayouts[activeTab].width,
                    height: 1,
                    backgroundColor: '#f2f2f2',
                    zIndex: 1,
                  }}
                />
              )}
            </View>
            <View style={styles.reviewContentBox}>

              <View style={styles.locationRow}>
                <LocationIcon width={14} height={17.746} />
                <Text style={styles.locationText}>
                  {cafe.address}
                </Text>
              </View>

              <View style={styles.separator}></View>

              <View style={styles.locationRow}>
                <TimeIcon width={18} height={18} />
                <View>
                  <Text style={{ flexDirection: 'row', flexWrap: 'wrap', fontSize: 16, marginLeft: 12, }}>
                    {openStatus.statusParts.map((part, index) => (
                      <Text key={index} style={[{
                        color: part.color, fontFamily: 'Manrope', fontSize: 12, fontStyle: 'normal', lineHeight: 22, // space between icon and text
                      }]}>
                        {part.text}
                      </Text>
                    ))}
                  </Text>
                </View>
              </View>

              <View style={styles.separator}></View>

              <View style={styles.locationRow}>
                <WebIcon width={24} height={24} />
                {cafe.website ? (
                  <Text
                    style={[styles.locationText, { color: '#3C751E', textDecorationLine: 'underline' }]}
                    onPress={() => Linking.openURL(cafe.website)}
                  >
                    {cafe.website}
                  </Text>
                ) : (
                  <Text style={styles.locationText}>
                    No website available
                  </Text>
                )}
              </View>

              <View style={styles.separator}></View>

              <View style={styles.locationRow}>
                <PhoneIcon width={18} height={18} />
                <Text style={styles.locationText}>
                  {cafe.phoneNumber || 'No phone number available'}
                </Text>
              </View>

              <View style={styles.separator}></View>
              {
                <View>
                  <Text style={styles.label}>Ammenities</Text>
                  <View style={styles.labelRow}>
                    {[
                      ...Object.entries(goodLabels).map(([label, count]) => ({ label, count, color: '#3C751E' })),
                      ...Object.entries(badLabels).map(([label, count]) => ({ label, count, color: '#E6725A' }))
                    ].map(({ label, count, color }) => (
                      <Labels
                        key={label}
                        label={label}
                        color={color}
                      />
                    ))}
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.crowdnessContainer}>
                    <Text style={styles.crowdLabel}>Crowd Levels</Text>
                    <CrowdednessSlider
                      crowdedness={crowdedness}>
                    </CrowdednessSlider>
                  </View>

                  <CrowdednessGraph occupancyData={cafe.occupancy} />

                </View>
              }
            </View>
          </View>
        )}
        {activeTab === 'Menu' && (
          <View style={{ width: '100%', position: 'relative' }}>
            <View>
              {tabLayouts[activeTab] && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: tabLayouts[activeTab].x,
                    width: tabLayouts[activeTab].width,
                    height: 1,
                    backgroundColor: '#f2f2f2',
                    zIndex: 1,
                  }}
                />
              )}
            </View>
            <View style={styles.reviewContentBox}>
                <View style={styles.menuRow}>
                  {cafe.website ? (
                    <Text style={styles.menuWebsite}>
                      <Text style={styles.menuText}>Website   </Text>
                      <Text
                        style={{ color: '#3C751E', textDecorationLine: 'underline' }}
                        onPress={() => Linking.openURL(cafe.website)}
                      >
                        {cafe.website}
                      </Text>
                    </Text>
                  ) : (
                    <Text style={styles.menuWebsite}>
                      No website available
                    </Text>
                  )}
                  <WebIcon width={24} height={24} />
                </View>
                <View style={styles.separator}></View>
                <View style = {styles.menuRow}>
                  <Text style={[styles.menuText]}>View Menu</Text>
                  <Pressable onPress={() => {}}>
                    <Text style={styles.menuButton}>
                      add picture
                    </Text>
                  </Pressable>
                </View>
                <MenuSlider photos={menuPhotos} />
                <View style={styles.separator}></View>
                <Text style={[styles.menuText]}>Top Items</Text>
                <ItemSlider photos={itemPhotos} 
                  items={["Vietnamese Iced Coffee", "Bonsai Latte", "Dirty Taro Latte"]}
                  prices={[7.5, 7.5, 7.5]}
                  recommendationCount={[10, 6, 5]}
                 />
              </View>
            </View>

        )}
        {activeTab === 'Reviews' && (
          <View style={{ width: '100%', position: 'relative' }}>
            <View>
              {tabLayouts[activeTab] && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: tabLayouts[activeTab].x,
                    width: tabLayouts[activeTab].width,
                    height: 1,
                    backgroundColor: '#f2f2f2',
                    zIndex: 1,
                  }}
                />
              )}
            </View>
            <View style={styles.reviewContentBox}>
              <View style={styles.buttonShadowWrapper}>
                <Pressable onPress={() => setShowForm(true)} style={styles.buttonReviews}>
                  <Text style={styles.buttonText}>Add a rating ...</Text>
                </Pressable>
              </View>

              {loading ? (
                <ActivityIndicator />
              ) : (
                reviews
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((review, index) => {
                    const isExpanded = expandedCards.has(index);
                    const fullComment = review.cafeComments || review.caption || '';
                    const shortComment =
                      fullComment.split(' ').slice(0, 10).join(' ') +
                      (fullComment.split(' ').length > 10 ? '...' : '');

                    const rating = review.ratings || {};
                    const drinks = rating.drinks || {};

                    return (
                      <View key={index} style={styles.reviewCardShadowWrapper}>
                        <Pressable
                          style={styles.reviewCard}
                          onPress={() => toggleCard(index)}
                        >

                          <View style={styles.headerRow}>
                            <Image
                              source={require('../../assets/images/Jenny.png')} // your static image path
                              style={styles.avatar}
                            />
                            <View style={styles.userInfo}>
                              <Text style={styles.reviewUser}>{review.user}</Text>
                              <StarRating rating={rating.overall || 0} size={16} color="black" readOnly />
                            </View>
                          </View>

                          <Text style={styles.reviewText}>
                            {isExpanded ? fullComment : shortComment}
                          </Text>

                          {isExpanded && (
                            <View style={styles.expandedContent}>
                              {rating.vibe > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={[styles.reviewText, { fontWeight: 'bold' }]}>Vibe</Text>
                                  <StarRating rating={rating.vibe} size={12} color="#000000" readOnly />
                                </View>
                              )}

                              {rating.ammenities > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={[styles.reviewText, { fontWeight: 'bold' }]}>Amenities</Text>
                                  <StarRating rating={rating.ammenities} size={12} color="#000000" readOnly />
                                </View>
                              )}

                              {rating.drinkQuality > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={[styles.reviewText, { fontWeight: 'bold' }]}>Drink Quality</Text>
                                  <StarRating rating={rating.drinkQuality} size={12} color="#000000" readOnly />
                                </View>
                              )}

                              {review.drinkReccomendations?.trim() && (
                                <Text style={styles.reccomendationText}>
                                  <Text style={{ fontWeight: 'bold' }}>Drink Recommendation: </Text>
                                  {review.drinkReccomendations}
                                </Text>
                              )}

                              {drinks.coffee > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={[styles.reviewText, { fontWeight: 'bold' }]}>Coffee</Text>
                                  <StarRating rating={drinks.coffee} size={12} color="#000000" readOnly />
                                </View>
                              )}

                              {drinks.matcha > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={[styles.reviewText, { fontWeight: 'bold' }]}>Matcha</Text>
                                  <StarRating rating={drinks.matcha} size={12} color="#000000" readOnly />
                                </View>
                              )}

                              {drinks.tea > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={[styles.reviewText, { fontWeight: 'bold' }]}>Tea</Text>
                                  <StarRating rating={drinks.tea} size={12} color="#000000" readOnly />
                                </View>
                              )}

                              {drinks.specialty > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={[styles.reviewText, { fontWeight: 'bold' }]}>Specialty</Text>
                                  <StarRating rating={drinks.specialty} size={12} color="#000000" readOnly />
                                </View>
                              )}

                              {(review.labels?.good?.length || review.labels?.bad?.length) > 0 && (
                                <View style={{ marginTop: 8, flexWrap: 'wrap', flexDirection: 'row' }}>
                                  {review.labels.good?.map((label: string, i: number) => (
                                    <Text
                                      key={`good-${i}`}
                                      style={{
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        backgroundColor: '#DFF5E1', // light green
                                        color: '#2E7D32',           // dark green
                                        borderRadius: 12,
                                        marginRight: 6,
                                        marginBottom: 4,
                                        fontSize: 12,
                                        fontWeight: '500',
                                      }}
                                    >
                                      {label}
                                    </Text>
                                  ))}
                                  {review.labels.bad?.map((label: string, i: number) => (
                                    <Text
                                      key={`bad-${i}`}
                                      style={{
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        backgroundColor: '#FBE5E5', // light red/pink
                                        color: '#C62828',           // dark red
                                        borderRadius: 12,
                                        marginRight: 6,
                                        marginBottom: 4,
                                        fontSize: 12,
                                        fontWeight: '500',
                                      }}
                                    >
                                      {label}
                                    </Text>
                                  ))}
                                </View>
                              )}


                              <Text style={styles.date}>{getRelativeTime(review.date)}</Text>

                            </View>
                          )}
                        </Pressable>
                      </View>
                    );
                  })
              )}



            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // alignItems: 'center',
    padding: 20,
  },
  buttonShadowWrapper: {
    alignSelf: 'center',
    width: '100%',
    borderRadius: 8,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Elevation for Android
    elevation: 5,

    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // Button surface itself
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 22,
    color: '#000',
    alignSelf: 'flex-start',
  },
  reviewCardShadowWrapper: {
    borderRadius: 8,
    marginBottom: 12,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Elevation for Android
    elevation: 4,

    backgroundColor: 'transparent', // wrapper stays invisible
  },
  reviewCard: {
    backgroundColor: '#eee',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#E2F0DA', // Button surface itself
  },
  reviewText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  reccomendationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center', // <-- This centers items vertically
    gap: 8, // RN 0.71+; otherwise use marginRight on avatar
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 999, // optional: makes it circular
    borderColor: "3C751E",
    borderWidth: 1,
    marginRight: 10, // fallback if no gap support
  },
  userInfo: {
    justifyContent: 'center',
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4, // small space between name and stars
  },
  extraHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 6,
  },
  expandedContent: {
    paddingTop: 10,
  },
  cafeInfo: {
    // marginBottom: 16,
    width: '100%',
    // backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  cafeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cafeName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    lineHeight: 36,
  },
  cafeAddress: {
    fontSize: 14,
    color: "#000000",
    marginTop: 8,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    lineHeight: 22,
  },
  cafeDescription: {
    fontSize: 14,
    color: '#333',
  },
  rating: {
    alignItems: 'flex-start',
  },
  roundedImageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    alignItems: 'center',
  },
  reviewImage: {
    width: '100%',
    height: '100%',
  },
  imageAndInfoContainer: {
    marginBottom: 20, // add separation from next section
  },
  reviewContentBox: {
    padding: 16,
  },
  labelRow: {
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  buttonReviews: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2F0DA', // Button surface itself
    borderWidth: 1,
    borderColor: '#ccc',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 12, // space between icon and text
    flexShrink: 1,  // so the text wraps nicely if it's too long
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    lineHeight: 22,
  },
  openStatusText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // left and right
    paddingHorizontal: 16,
    height: 56, // or whatever header height you want
    backgroundColor: '#fff', // if you need background
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 12, // space between the two icons
  },
  crowdnessContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 8, // Optional: space around
  },
  crowdLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
    width: '100%', // <-- important to align with the pill
    marginBottom: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // <-- important
    width: '100%',
  },
  menuWebsite: {
    fontSize: 12,
    color: '#333',
    flexShrink: 1, // <-- Allow text to wrap or shrink if necessary
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    lineHeight: 22,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1, // <-- Allow text to wrap or shrink if necessary
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    lineHeight: 22,
    fontWeight: '600',
  },
  menuButton: {
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    lineHeight: 22,
    fontSize: 12,
    color: '#3C751E',
  }
});

export default ReviewScreen;
