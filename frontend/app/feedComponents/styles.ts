import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
    opacity: 0.5,
  },
  cafeCard: {
    padding: 16,
    borderRadius: 10,
    marginRight: 12,
    width: 160,
    justifyContent: 'flex-end'
  },
  cafeImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  cafeName: {
    fontWeight: '600',
    marginBottom: 4
  },
  collectionCard: {
    backgroundColor: '#E6F1E5',
    padding: 20,
    borderRadius: 10,
    marginVertical: 6
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000'
  },
  rankCard: {
    backgroundColor: '#E6F1E5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10
  },
  trendingCard: {
    width: 160,
    height: 160,
    justifyContent: 'flex-end',
    borderRadius: 16,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 16,
    padding: 10,
    justifyContent: 'flex-end',
  },
  trendingCardText: {
    color: 'white',
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 16,
  },
});

export default styles;