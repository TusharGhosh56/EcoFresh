# Profile System Testing Guide - EcoFresh

## 🧪 How to Test the Profile Features

### Prerequisites
1. Make sure the development server is running: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Login/Register with a test account

---

## 🔍 Test Scenarios

### 1. **Profile Page Access**
- ✅ Click on "Profile" in the navigation bar
- ✅ Should navigate to the profile page (`#profile`)
- ✅ Verify user information is displayed correctly

### 2. **Pinning Cities from Dashboard**
- ✅ Go to Dashboard (`#dashboard`)
- ✅ Select a country (e.g., "United States")
- ✅ Select a state/city (e.g., "California" or direct city)
- ✅ Click on any city card to pin it
- ✅ Should see green notification: "City added to monitoring"
- ✅ City should appear in "Monitored Cities" section

### 3. **Firebase Data Persistence**
- ✅ Pin several cities from Dashboard
- ✅ Go to Profile page
- ✅ Verify pinned cities appear in "Pinned Cities" section
- ✅ Refresh the browser
- ✅ Verify data persists after refresh
- ✅ Logout and login again
- ✅ Verify data persists across sessions

### 4. **Unpinning Cities**
- ✅ Go to Profile page
- ✅ Click the "X" button on any pinned city
- ✅ City should be removed from the list
- ✅ Go back to Dashboard
- ✅ Verify city is no longer in "Monitored Cities"

### 5. **Monitoring Statistics**
- ✅ Monitor the same city multiple times from Dashboard
- ✅ Go to Profile page
- ✅ Check "Most Frequently Monitored Places" section
- ✅ Verify the count increases with each monitoring action
- ✅ Cities should be ranked by frequency

### 6. **Notification System**
- ✅ Pin a city from Dashboard → Should see green "added" notification
- ✅ Unpin from monitored cities → Should see blue "removed" notification
- ✅ Notifications should auto-hide after 3 seconds
- ✅ Can manually close notifications with X button

### 7. **Navigation Flow**
- ✅ Use "Go to Dashboard" button from Profile
- ✅ Use "View Analytics" button from Profile
- ✅ Navigation should work seamlessly between pages

---

## 🗂️ Firebase Data Verification

### Check Firebase Console:
1. Go to Firebase Console → Firestore Database
2. Navigate to `users` collection
3. Find your user document (by UID)
4. Verify the following fields exist:
   ```javascript
   {
     firstName: "...",
     lastName: "...",
     email: "...",
     pinnedCities: ["City1", "City2", ...],
     monitoringStats: [
       { name: "City1", count: 5 },
       { name: "City2", count: 3 }
     ]
   }
   ```

---

## 🐛 Common Issues & Solutions

### Issue: Profile page shows "No pinned cities"
- **Solution**: Go to Dashboard and pin some cities first

### Issue: Data not persisting
- **Solution**: Check Firebase configuration and ensure user is logged in

### Issue: Notifications not showing
- **Solution**: Verify the Notification component is imported and used correctly

### Issue: Cities not appearing in monitoring stats
- **Solution**: Make sure to click on cities multiple times to increment the count

---

## 📱 Responsive Testing

### Desktop (1200px+)
- ✅ Profile layout should show 3-column grid for pinned cities
- ✅ Navigation bar should show all links

### Tablet (768px - 1199px)
- ✅ Profile layout should show 2-column grid
- ✅ All features should work

### Mobile (< 768px)
- ✅ Profile layout should show single column
- ✅ Navigation should be responsive
- ✅ Touch interactions should work

---

## ✨ Expected User Experience

1. **Seamless Integration**: Profile features should feel native to the app
2. **Fast Performance**: Data should load quickly from Firebase
3. **Visual Feedback**: Users should see notifications for all actions
4. **Data Persistence**: Settings should survive browser refreshes and re-logins
5. **Intuitive Navigation**: Easy movement between Dashboard and Profile

---

## 🎯 Success Criteria

- ✅ All pinned cities are saved to Firebase per user
- ✅ Monitoring statistics are tracked and displayed
- ✅ Data persists across browser sessions
- ✅ Profile page loads user data correctly
- ✅ Notifications provide clear feedback
- ✅ Navigation works smoothly
- ✅ Responsive design works on all devices
- ✅ No console errors during normal usage

**The profile system is now fully integrated and ready for production use!** 🚀
