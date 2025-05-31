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
  Image
} from 'react-native';
import ReviewForm from '../reviewComponents/ReviewForm';
import StarRating from '../reviewComponents/StarRating';
import ReturnIcon from '../../assets/images/Group.svg'
import TabSelector from './TabSelector';
import { auth } from '../../firebase/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { on } from 'events';
import Labels from './labels';


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

  console.log('Current user:', user);

  const [activeTab, setActiveTab] = useState<'Menu' | 'Info' | 'Reviews'>('Reviews');

  const [tabLayouts, setTabLayouts] = useState<{ [key in 'Menu' | 'Info' | 'Reviews']?: { x: number; width: number } }>({});

  const fetchCafeInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cafes/getByID/${cafeID}`);
      const data = await response.json();
      setCafe(data);
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

    console.log('Filtered Good Labels:', filteredGood);
    console.log('Filtered Bad Labels:', filteredBad);


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
      user: user?.email || 'user123',     // Replace with real user ID if available
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
            <Pressable onPress={goBack} style={styles.backButton}>
              <ReturnIcon width={24} height={24} />
            </Pressable>

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
                  <StarRating rating={parseFloat(cafe.rating) || 0} size={20} readOnly />
                </View>
                <Text style={styles.cafeAddress}>{cafe.address}</Text>
              </View>
            </View>

          </>
        )}

        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} setTabLayouts={setTabLayouts} />
        {activeTab === 'Info' && cafe && (
          <View style={{ width: '100%', position: 'relative' }}>
            <View style={styles.fullTopBorder}>
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

                </View>
              }
            </View>
          </View>
        )}
        {activeTab === 'Menu' && (
          <View style={{ width: '100%', position: 'relative' }}>
            <View style={styles.fullTopBorder}>
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
            <View style={styles.fullTopBorder}>
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
                <Pressable onPress={() => setShowForm(true)} style={styles.button}>
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
                            <Text style={styles.reviewUser}>{review.user}</Text>
                            <StarRating rating={rating.overall || 0} size={16} readOnly />
                          </View>

                          <Text style={styles.reviewText}>
                            {isExpanded ? fullComment : shortComment}
                          </Text>

                          {isExpanded && (
                            <View style={styles.expandedContent}>
                              {rating.vibe > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={styles.reviewUser}>Vibe</Text>
                                  <StarRating rating={rating.vibe} size={12} readOnly />
                                </View>
                              )}

                              {rating.ammenities > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={styles.reviewUser}>Amenities</Text>
                                  <StarRating rating={rating.ammenities} size={12} readOnly />
                                </View>
                              )}

                              {rating.drinkQuality > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={styles.reviewUser}>Drink Quality</Text>
                                  <StarRating rating={rating.drinkQuality} size={12} readOnly />
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
                                  <Text style={styles.reviewUser}>Coffee</Text>
                                  <StarRating rating={drinks.coffee} size={12} readOnly />
                                </View>
                              )}

                              {drinks.matcha > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={styles.reviewUser}>Matcha</Text>
                                  <StarRating rating={drinks.matcha} size={12} readOnly />
                                </View>
                              )}

                              {drinks.tea > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={styles.reviewUser}>Tea</Text>
                                  <StarRating rating={drinks.tea} size={12} readOnly />
                                </View>
                              )}

                              {drinks.specialty > 0 && (
                                <View style={styles.extraHeaderRow}>
                                  <Text style={styles.reviewUser}>Specialty</Text>
                                  <StarRating rating={drinks.specialty} size={12} readOnly />
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
    backgroundColor: '#fff', // Button surface itself
  },
  reviewUser: {
    fontWeight: '600',
    marginBottom: 4,
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
    marginTop: 6,
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
  },
  headerRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 6,
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
    color: '#555',
    marginTop: 8,
    marginBottom: 4,
  },
  cafeDescription: {
    fontSize: 14,
    color: '#333',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
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
  fullTopBorder: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
  },
  reviewContentBox: {
    borderWidth: 1,
    borderTopWidth: 0, // the segmented border handles the top line
    borderColor: '#ccc',
    // borderRadius: 8,
    padding: 16,
  },
  labelRow: {
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

export default ReviewScreen;
