// app/dashboard/profile/page.tsx (Server Component)
import { getUserProfile } from "@/lib/actions/userActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "./ProfileForm";
import { Shield, User, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  // Get initials for avatar
  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with avatar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and security settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md">
              {initials}
            </div>
            <div>
              <p className="font-medium">{profile.fullName}</p>
              <p className="text-xs text-muted-foreground">Verified Member</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information Card */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Personal Information
            </CardTitle>
            <CardDescription>
              Update your name, email, and phone number.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ProfileForm profile={profile} />
          </CardContent>
        </Card>

        {/* Identification Details Card */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Identification Details
            </CardTitle>
            <CardDescription>
              Your registered ID numbers (read-only). Contact support for
              changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-muted-foreground">National ID:</span>
              <span className="font-mono font-medium">
                {profile.nationalId || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-muted-foreground">Personal Number:</span>
              <span className="font-mono font-medium">
                {profile.personalNumber || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-muted-foreground">Date of Birth:</span>
              <span className="font-medium">
                {profile.dob
                  ? new Date(profile.dob).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </span>
            </div>
            <div className="mt-4 p-3 bg-primary/5 rounded-lg text-xs text-muted-foreground">
              <Shield className="h-3 w-3 inline mr-1" /> These details are
              verified during registration and cannot be changed online.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optional Security Card (Password Change) - can be added later */}
      <Card className="border-border/50 shadow-sm max-w-md">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" /> Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button variant="outline" className="gap-2" asChild>
            <a href="/dashboard/profile/change-password">Change Password</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
