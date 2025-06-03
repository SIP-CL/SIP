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
import ReviewForm from '../reviewComponents/ReviewForm';
import StarRating from '../reviewComponents/StarRating';
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
import Labels from './labels';
import CrowdednessSlider from './crowdedness';
import CrowdednessGraph from './occupancyGraph';

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
const getOpenStatusWithTimes = (hoursMap: any) => {
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let dayIndex = now.getDay();
  let hour = now.getHours();
  let minute = now.getMinutes();

  // Late Night Handling (shift 12am-3am back to the previous day)
  const isLateNight = hour < 4;
  const effectiveDayIndex = isLateNight ? (dayIndex - 1 + 7) % 7 : dayIndex;
  const currentDay = daysOfWeek[effectiveDayIndex];
  const todayHours = hoursMap[currentDay];

  if (!todayHours) {
    return {
      statusParts: [
        { text: 'Closed today', color: '#E6725A' }
      ]
    };
  }

  // --- Dynamic timeKeys based on todayHours ---
  const timeKeys = Object.keys(todayHours);

  // Sort timeKeys properly (12am, 12:30am, 1am, 1:30am, ...)
  timeKeys.sort((a, b) => timeKeyToMinutes(a) - timeKeyToMinutes(b));

  // --- Find the current timeKey ---
  const nowMinutes = hour * 60 + minute;
  let currentTimeKey = null;
  for (let i = 0; i < timeKeys.length; i++) {
    if (timeKeyToMinutes(timeKeys[i]) <= nowMinutes) {
      currentTimeKey = timeKeys[i];
    } else {
      break;
    }
  }

  if (!currentTimeKey) {
    currentTimeKey = timeKeys[0];
  }

  const hourValue = todayHours[currentTimeKey];
  const isOpenNow = hourValue?.value === 1;

  if (isOpenNow) {
    // Find when it closes today
    for (let i = timeKeys.indexOf(currentTimeKey) + 1; i < timeKeys.length; i++) {
      const nextHourValue = todayHours[timeKeys[i]];
      const nextOpen = nextHourValue?.value === 1;
      if (!nextOpen) {
        return {
          statusParts: [
            { text: 'Open', color: '#3C751E' },
            { text: ` until ${formatTime(timeKeys[i])}`, color: '#000000' }
          ]
        };
      }
    }
    return {
      statusParts: [
        { text: 'Open', color: '#3C751E' },
        { text: ' now', color: '#000000' }
      ]
    };
  } else {
    // Find next open time today
    for (let i = timeKeys.indexOf(currentTimeKey) + 1; i < timeKeys.length; i++) {
      const nextHourValue = todayHours[timeKeys[i]];
      const nextOpen = nextHourValue?.value === 1;
      if (nextOpen) {
        return {
          statusParts: [
            { text: 'Closed now', color: '#E6725A' },
            { text: `, opens at ${formatTime(timeKeys[i])}`, color: '#000000' }
          ]
        };
      }
    }
    // Search next days
    for (let j = 1; j <= 7; j++) {
      const nextDayIndex = (effectiveDayIndex + j) % 7;
      const nextDay = daysOfWeek[nextDayIndex];
      const nextDayHours = hoursMap[nextDay];
      if (nextDayHours) {
        const nextTimeKeys = Object.keys(nextDayHours).sort((a, b) => timeKeyToMinutes(a) - timeKeyToMinutes(b));
        for (const key of nextTimeKeys) {
          const nextHourValue = nextDayHours[key];
          const nextOpen = nextHourValue?.value === 1;
          if (nextOpen) {
            return {
              statusParts: [
                { text: 'Closed now', color: '#E6725A' },
                { text: `, opens at ${formatTime(key)} on ${nextDay}`, color: '#000000' }
              ]
            };
          }
        }
      }
    }
    return {
      statusParts: [
        { text: 'Closed for the week', color: '#E6725A' }
      ]
    };
  }
};

function getTodayOpenHours(hoursMap: any) {
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayIndex = now.getDay();
  const currentDay = daysOfWeek[dayIndex];
  const nextDay = daysOfWeek[(dayIndex + 1) % 7];

  const todayHours = hoursMap[currentDay];
  const nextDayHours = hoursMap[nextDay];

  if (!todayHours) {
    return null;
  }

  const todayTimeKeys = Object.keys(todayHours).sort((a, b) => timeKeyToMinutes(a) - timeKeyToMinutes(b));

  // Filter only times after 4:00 AM for *earliest* search
  const filteredTimesForEarliest = todayTimeKeys.filter((key) => {
    const minutes = timeKeyToMinutes(key);
    return minutes >= 4 * 60; // 4:00 AM = 240 minutes
  });

  // Find first time where value is 1 (open)
  const openTimesToday = filteredTimesForEarliest.filter((key) => {
    const val = todayHours[key];
    return val?.value === 1;
  });

  if (openTimesToday.length === 0) {
    return null;
  }

  const earliest = openTimesToday[0];

  // For latest time, check today's open hours and tomorrow's early hours (0am to 3am)
  const lateTimesToday = todayTimeKeys.filter((key) => {
    const val = todayHours[key];
    return val?.value === 1;
  });

  let lateTimesNextDay: string[] = [];
  if (nextDayHours) {
    const nextDayTimeKeys = Object.keys(nextDayHours).sort((a, b) => timeKeyToMinutes(a) - timeKeyToMinutes(b));

    // Only consider early morning times (12am–3am)
    lateTimesNextDay = nextDayTimeKeys.filter((key) => {
      const minutes = timeKeyToMinutes(key);
      return minutes < 4 * 60 && nextDayHours[key]?.value === 1;
    });
  }

  const allLateTimes = [...lateTimesToday, ...lateTimesNextDay];

  if (allLateTimes.length === 0) {
    return null;
  }

  const latest = allLateTimes[allLateTimes.length - 1];

  return {
    earliest: formatTime(earliest),
    latest: formatTime(latest)
  };
}

function getCurrentOccupancy(hoursMap: any): number | null {
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let dayIndex = now.getDay();
  let hour = now.getHours();
  let minute = now.getMinutes();

  // Late Night Handling (shift 12am-3am back to the previous day)
  const isLateNight = hour < 4;
  const effectiveDayIndex = isLateNight ? (dayIndex - 1 + 7) % 7 : dayIndex;
  const currentDay = daysOfWeek[effectiveDayIndex];
  const todayHours = hoursMap[currentDay];

  if (!todayHours) {
    return null; // No data for today
  }

  // --- Dynamic timeKeys based on todayHours ---
  const timeKeys = Object.keys(todayHours);

  // Sort timeKeys properly
  timeKeys.sort((a, b) => timeKeyToMinutes(a) - timeKeyToMinutes(b));

  // Convert current time to minutes
  const nowMinutes = hour * 60 + minute;

  // Find the latest timeKey not after now
  let currentTimeKey = null;
  for (let i = 0; i < timeKeys.length; i++) {
    if (timeKeyToMinutes(timeKeys[i]) <= nowMinutes) {
      currentTimeKey = timeKeys[i];
    } else {
      break;
    }
  }

  if (!currentTimeKey) {
    currentTimeKey = timeKeys[0]; // Edge case: before first opening time
  }

  const hourValue = todayHours[currentTimeKey];

  if (hourValue?.value !== 1) {
    return 0; // Closed at this time
  }

  return hourValue?.crowdedness ?? null; // Return occupancy percentage if open
}

// --- Helper: Convert '7am' or '7:30pm' to minutes past midnight ---
function timeKeyToMinutes(timeKey: string) {
  const match = timeKey.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);
  if (!match) return 0;
  let [_, hourStr, minuteStr, period] = match;
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr || '0', 10);
  if (period === 'pm' && hour !== 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;
  return hour * 60 + minute;
}

// --- Helper: Format '7am' or '7:30pm' nicely ---
function formatTime(timeKey: string) {
  const match = timeKey.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);
  if (!match) return timeKey;
  let [_, hourStr, minuteStr, period] = match;
  let hour = parseInt(hourStr, 10);
  let minute = minuteStr ? parseInt(minuteStr, 10) : 0;
  const periodUpper = period.toUpperCase();
  return `${hour}:${minute.toString().padStart(2, '0')} ${periodUpper}`;
}

function formatTimeToCafeFormat(timeKey: string) {
  const match = timeKey.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/i);
  if (!match) return timeKey;
  let [_, hourStr, minuteStr, period] = match;
  let hour = parseInt(hourStr, 10);
  if (minuteStr !== '00') {
    // If minutes are not 00, convert to "7:30am" etc.
    return `${hour}:${minuteStr}${period.toLowerCase()}`;
  } else {
    return `${hour}${period.toLowerCase()}`; // "7am", "4pm"
  }
}

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
  const [occupancyData, setOccupancyData] = useState<{ [day: string]: { hour: string, value: number }[] }>({});

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
      const currentOccupancy = getCurrentOccupancy(data.hours);
      setCrowdedness(currentOccupancy);

      // --- NEW: Generate occupancy data for all days ---
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const allDaysOccupancy: { [day: string]: { hour: string; value: number }[] } = {};

      daysOfWeek.forEach(day => {
        const dayHours = data.hours[day];
        if (dayHours) {
          const timeKeys = Object.keys(dayHours).sort((a, b) => timeKeyToMinutes(a) - timeKeyToMinutes(b));
          const filteredHours = timeKeys
            .filter(timeKey => dayHours[timeKey]?.value === 1)
            .map(timeKey => ({
              hour: timeKey,
              value: dayHours[timeKey].crowdedness ?? 0,
            }));
          allDaysOccupancy[day] = filteredHours;
        }
      });

      setOccupancyData(allDaysOccupancy);  // 👈 new

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

                  {occupancyData && (
                    <CrowdednessGraph occupancyData={occupancyData} />
                  )}


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
              {/* <View style={styles.cafeInfo}>
                <Text style={styles.label}>Menu:</Text>
                <Text style={styles.cafeDescription}>Menu items will be displayed here.</Text>
              </View> */}
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
  }

});

export default ReviewScreen;
