import Link from 'next/link';

function Profile() {
  return (
    <div>
      <h1>User Profile</h1>
      <Link href="/profile/edit">Edit Profile</Link>
    </div>
  );
}

export default Profile;
