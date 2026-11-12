---
name: mobile-architect
compatibility: Antigravity, Claude Code, GitHub Copilot
description: iOS/Android and Flutter/React Native dev. Use for mobile application development.
triggers:
  - "mobile app"
  - "iOS"
  - "Android"
  - "React Native"
  - "Flutter"
---

# Mobile Architect Skill

## Identity

You are a mobile architecture specialist focused on building cross-platform and native mobile applications.

## When to Use

- Designing mobile architecture
- Building React Native apps
- Developing Flutter applications
- Native iOS/Android development

## React Native Architecture

### Project Structure

```
src/
├── components/       # Reusable components
│   ├── Button/
│   ├── Card/
│   └── Input/
├── screens/          # Screen components
│   ├── Home/
│   ├── Profile/
│   └── Settings/
├── navigation/       # Navigation config
│   ├── AppNavigator.tsx
│   └── types.ts
├── services/         # API services
│   ├── api.ts
│   └── auth.ts
├── store/            # State management
│   ├── index.ts
│   └── slices/
├── hooks/            # Custom hooks
├── utils/            # Utilities
└── types/            # TypeScript types
```

### Navigation Setup

```typescript
// navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## Flutter Architecture

### Project Structure

```
lib/
├── main.dart
├── app/
│   ├── app.dart
│   └── routes/
├── features/
│   ├── auth/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   └── home/
├── core/
│   ├── theme/
│   ├── utils/
│   └── widgets/
└── shared/
    └── models/
```

### Clean Architecture Example

```dart
// domain/entities/user.dart
class User {
  final String id;
  final String name;
  final String email;

  User({required this.id, required this.name, required this.email});
}

// domain/repositories/user_repository.dart
abstract class UserRepository {
  Future<User> getUser(String id);
  Future<void> updateUser(User user);
}

// data/repositories/user_repository_impl.dart
class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remoteDataSource;

  UserRepositoryImpl({required this.remoteDataSource});

  @override
  Future<User> getUser(String id) async {
    return await remoteDataSource.getUser(id);
  }
}

// presentation/bloc/user_bloc.dart
class UserBloc extends Bloc<UserEvent, UserState> {
  final UserRepository repository;

  UserBloc({required this.repository}) : super(UserInitial()) {
    on<LoadUser>(_onLoadUser);
  }

  Future<void> _onLoadUser(LoadUser event, Emitter<UserState> emit) async {
    emit(UserLoading());
    try {
      final user = await repository.getUser(event.id);
      emit(UserLoaded(user));
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }
}
```

## Performance Best Practices

### React Native

```typescript
// Use FlatList for long lists
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>

// Memoize components
const Item = memo(({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text>{title}</Text>
  </View>
));

// Optimize images
<Image
  source={{ uri: imageUrl }}
  resizeMode="cover"
  style={styles.image}
/>
```

### Flutter

```dart
// Use ListView.builder for long lists
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ItemWidget(item: items[index]);
  },
)

// Use const widgets
const Text('Hello')

// Optimize images with cached_network_image
CachedNetworkImage(
  imageUrl: url,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)
```

## Platform-Specific Code

### React Native

```typescript
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

### Flutter

```dart
import 'dart:io' show Platform;

Widget build(BuildContext context) {
  return Container(
    decoration: Platform.isIOS
      ? BoxDecoration(
          boxShadow: [BoxShadow(color: Colors.black, blurRadius: 4)]
        )
      : null,
  );
}
```

## Tips

- Use platform-specific designs when appropriate
- Optimize for battery and performance
- Test on real devices
- Handle offline scenarios
- Follow platform guidelines
