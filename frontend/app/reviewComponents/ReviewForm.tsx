import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import StarRating from './StarRating';
import AddPhotos from '../../assets/images/Camera.svg';
import CancelIcon from '../../assets/images/Close_LG.svg';
import Labels from './labels';
import RatingSlider from './drinkRatingSlider'


type Props = {
  onSubmit: (
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
  ) => void;
  onCancel: () => void;
  cafeName: string;
};

const ReviewForm: React.FC<Props> = ({ onSubmit, onCancel, cafeName }) => {
  const [overall, setOverall] = useState<number>(0);
  const [drinkQuality, setDrinkQuality] = useState<number>(0);
  const [vibe, setVibe] = useState<number>(0);
  const [ammenities, setAmmenities] = useState<number>(0);
  
  const [cafeComments, setCafeComments] = useState<string>('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [drinkReccomendations, setDrinkReccomendations] = useState<string>('');

  const [coffee, setCoffee] = useState<number>(0);
  const [matcha, setMatcha] = useState<number>(0);
  const [tea, setTea] = useState<number>(0);
  const [specialty, setSpecialty] = useState<number>(0);

  const handleCoffeeChange = (value: number) => {
    if (coffee === 0) setCoffee(value); // first interaction
    else setCoffee(value);
  };

  const handleMatchaChange = (value: number) => {
    if (matcha === 0) setMatcha(value); // first interaction
    else setMatcha(value);
  };

  const handleTeaChange = (value: number) => {
    if (tea === 0) setTea(value); // first interaction
    else setTea(value);
  };

  const handleSpecialtyChange = (value: number) => {
    if (specialty === 0) setSpecialty(value); // first interaction
    else setSpecialty(value);
  };  

  const handleSubmit = () => {
    if (overall === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit(
      overall,
      drinkQuality,
      vibe,
      ammenities,
      cafeComments || '',
      selectedLabels,
      drinkReccomendations || '',
      coffee,
      matcha,
      tea,
      specialty
    );
    setOverall(0);
    setDrinkQuality(0);
    setVibe(0); 
    setAmmenities(0);
    setCafeComments('');
    setSelectedLabels([]);
    setDrinkReccomendations('');
    setCoffee(1);
    setMatcha(1);
    setTea(1);
    setSpecialty(1);
  };

  const goodLabels = [
    "Study Spot",
    "Pastries",
    "Late-night",
    "Comfy Seats",
    "Pet Friendly",
    "Good Music",
    "Outlets",
    "Free Wifi",
    "Group Friendly",
    "Good Service",
    "Natural Light"
  ];

  const badLabels = [
    "Loud Music",
    "Inconsistent",
    "Bad Seating",
    "Stuffy",
    "No Wifi",
    "No Bathroom",
    "No Outlets",
    "Long Wait",
    "Bad Service",
    "Time Limit",
    "Dirty"
  ];

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  return (
    <SafeAreaView>
      <View style={localStyles.container}>
        <Pressable onPress={onCancel} style={localStyles.cancelButton}>
            <CancelIcon width={20} height={20} style={localStyles.icon} />
        </Pressable>
        <View style={localStyles.cafeHeader}>
          <Text style={localStyles.cafeNameText}>{cafeName}</Text>
          <View style={localStyles.separator} />
        </View>
        <View style={localStyles.header}>
          <Text style={localStyles.headerText}>Rate your overall experience.</Text>
        </View>

        <View style={localStyles.ratingGroup}>
          <StarRating rating={overall} onPress={setOverall} />
        </View>

        <TextInput
          style={localStyles.commentInput}
          placeholder= {`Tell use what you thought about ${cafeName}`}
          multiline
          value={cafeComments}
          onChangeText={setCafeComments}
        />

        <View style={localStyles.separator} />

        <View style={localStyles.ratingRow}>
          <Text style={localStyles.inlineLabel}>Drink Quality</Text>
          <StarRating rating={drinkQuality} onPress={setDrinkQuality} />
        </View>

        <View style={localStyles.ratingRow}>
          <Text style={localStyles.inlineLabel}>Vibe</Text>
          <StarRating rating={vibe} onPress={setVibe} />
        </View>

        <View style={localStyles.ratingRow}>
          <Text style={localStyles.inlineLabel}>Ammenities</Text>
          <StarRating rating={ammenities} onPress={setAmmenities} />
        </View>

        <View style={localStyles.separator} />

        <Pressable onPress={handleSubmit} style={[localStyles.button, localStyles.photosButton]}>
          <View style={localStyles.iconButtonContent}>
            <AddPhotos width={20} height={20} style={localStyles.icon} />
            <Text style={[localStyles.buttonText, localStyles.buttonTextPhotos]}>
              Add Photos
            </Text>
          </View>
        </Pressable>

        <View style={localStyles.separator} />

        <View>
          <Text style={localStyles.headerText}>Add Labels</Text>
          <View style={localStyles.labelRow}>
            {goodLabels.map((label) => (
              <Labels
                key={label}
                label={label}
                selected={selectedLabels.includes(label)}
                onPress={toggleLabel}
                color="#3C751E"
              />
            ))}
          </View>
          <View style={localStyles.labelRow}>
            {badLabels.map((label) => (
              <Labels
                key={label}
                label={label}
                selected={selectedLabels.includes(label)}
                onPress={toggleLabel}
                color="#E6725A"
              />
            ))}
          </View>
        </View>

        <View style={localStyles.separator} />

        <View style={localStyles.header}>
          <Text style={localStyles.headerText}>What drink do you recommend?</Text>
        </View>

        <TextInput
          style={[localStyles.commentInput, localStyles.drinkInput]}
          placeholder= {`ie: Vanilla Latte`}
          multiline
          value={drinkReccomendations}
          onChangeText={setDrinkReccomendations}
        />

        <View style={localStyles.separator} />

        <View style={localStyles.header}>
          <Text style={localStyles.headerText}>Drink Ratings</Text>
        </View>

        <View style={localStyles.ratingRow}>
          <Text style={localStyles.inlineLabel}>Coffee</Text>
          <RatingSlider value={coffee === 0 ? 1: coffee} onChange={handleCoffeeChange} />
        </View>
        
        <View style={localStyles.ratingRow}>
          <Text style={localStyles.inlineLabel}>Matcha</Text>
          <RatingSlider value={matcha === 0 ? 1 : matcha} onChange={handleMatchaChange} />
        </View>

        <View style={localStyles.ratingRow}>
          <Text style={localStyles.inlineLabel}>Tea</Text>
          <RatingSlider value={tea === 0 ? 1: tea} onChange={handleTeaChange} />
        </View>

        <View style={localStyles.ratingRow}>
          <Text style={localStyles.inlineLabel}>Specialty</Text>
          <RatingSlider value={specialty === 0 ? 1: specialty} onChange={handleSpecialtyChange} />
        </View>

        <Pressable onPress={handleSubmit} style={localStyles.button}>
          <Text style={localStyles.buttonText}>Add Cafe</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  separator:{
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginTop: 8, 
    marginBottom: 8,
  },
  cafeHeader: {
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
    position: 'relative', // <== Important to anchor absolute child

  },
  cafeNameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    lineHeight: 22,
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    paddingTop: 8,
    marginBottom: 20,
  },
  headerText: {
    color: '#000',
    fontFamily: 'Manrope',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'left',
    paddingBottom: 4,
  },
  ratingGroup: {
    marginBottom: 16,
  },
  ratingRow: {
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inlineLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
    color: '#000',
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    lineHeight: 22,
    textAlign: 'left',
    width: '30%',
    marginRight: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'center',
  },
  commentInput: {
    fontFamily: 'Manrope',
    fontSize: 10,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    height: 100,
    textAlignVertical: 'top', 
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    // Shadow for Android
    elevation: 2,
  },
  drinkInput: {
    height: 35,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 999, // Large enough to make it fully pill-shaped
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  photosButton:{
    backgroundColor: '#E2F0DA',
  },
  cancelButton: {
    position: 'absolute',
    top: 8,
    left: 0,
    padding: 8, // tap area
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextPhotos: {
    color: '#000',
    fontFamily: 'Manrope',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 22,
  },
  iconButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8, // space between icon and text
  },
  labelGroup: {
    marginTop: 8,
    marginBottom: 16,
  },
  labelGroupHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    fontFamily: 'Manrope',
  },
  labelRow: {
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default ReviewForm;
