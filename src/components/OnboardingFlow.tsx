"use client";
import React, { useState } from 'react';
import { Shield, User, Fingerprint, CheckCircle2, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Label, Badge, Progress } from './ui/primitives';
import { verifyBVN } from '../utils/smileIdMock'; 

export function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState('bvn');
  const [bvn, setBvn] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  
  const [kycData, setKycData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  const steps = [
    { id: 'bvn', label: 'BVN Verification', icon: Shield },
    { id: 'account', label: 'Account Setup', icon: User },
    { id: 'kyc', label: 'KYC Compliance', icon: Fingerprint },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = currentStep === 'complete' ? 100 : ((currentStepIndex + 1) / steps.length) * 100;

  const handleBvnVerify = async () => {
    setError('');
    setIsVerifying(true);

    try {
      const response = await verifyBVN(bvn);

      if (response.success) {
        setKycData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phoneNumber,
          email: `${response.data.firstName.toLowerCase()}.${response.data.lastName.toLowerCase()}@email.com` 
        });
        setCurrentStep('account');
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAccountSetup = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setCurrentStep('kyc');
    }, 1000);
  };

  const handleKycComplete = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setCurrentStep('complete');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#008753]/5 via-white to-[#008753]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="size-12 bg-gradient-to-br from-[#008753] to-[#00a864] rounded-xl flex items-center justify-center text-white font-bold text-2xl">B</div>
            <h1 className="text-[#008753] font-bold text-2xl">Bond Token Nigeria</h1>
          </div>
          <p className="text-slate-600">Your gateway to digital bond investment</p>
        </div>

        {currentStep !== 'complete' && (
           <div className="mb-8">
            <Progress value={progress} className="h-2 mb-4" />
            <div className="flex justify-between px-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isComplete = index < currentStepIndex;
                const isCurrent = step.id === currentStep;
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div className={`size-8 rounded-full flex items-center justify-center transition-colors ${isComplete ? 'bg-[#008753] text-white' : isCurrent ? 'bg-[#008753]/20 text-[#008753]' : 'bg-slate-100 text-slate-400'}`}>
                      {isComplete ? <CheckCircle2 className="size-5" /> : <Icon className="size-4" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 'bvn' && (
          <Card>
            <CardHeader>
              <CardTitle>BVN Verification</CardTitle>
              <CardDescription>Enter your Bank Verification Number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bvn">BVN (11 Digits)</Label>
                <Input 
                  id="bvn" 
                  placeholder="Enter 11-digit BVN" 
                  maxLength={11} 
                  value={bvn} 
                  onChange={(e) => {
                    setBvn(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  className={error ? "border-red-500 focus:ring-red-500" : ""}
                />
                {error && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {error}
                  </p>
                )}
              </div>
              
              <div className="bg-[#008753]/5 border border-[#008753]/20 rounded-lg p-3 flex gap-3">
                <Shield className="size-5 text-[#008753]" />
                <div className="text-xs">
                  <p className="text-[#008753] font-medium">Test Mode Active</p>
                  <p className="text-slate-600">Use <span className="font-mono bg-slate-200 px-1 rounded">00000000000</span> for success.</p>
                </div>
              </div>

              <Button 
                className="w-full bg-[#008753] hover:bg-[#006d42]" 
                onClick={handleBvnVerify} 
                disabled={bvn.length !== 11 || isVerifying}
              >
                {isVerifying ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" /> Verifying...</>
                ) : (
                  'Verify BVN'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 'account' && (
          <Card>
            <CardHeader>
              <CardTitle>Account Setup</CardTitle>
              <CardDescription>We retrieved these details from your BVN</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={kycData.firstName} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={kycData.lastName} readOnly className="bg-gray-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={kycData.phone} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input 
                  defaultValue={kycData.email} 
                  onChange={(e) => setKycData({...kycData, email: e.target.value})}
                />
              </div>
              <Button className="w-full bg-[#008753] hover:bg-[#006d42]" onClick={handleAccountSetup} disabled={isVerifying}>
                 {isVerifying ? <Loader2 className="animate-spin" /> : 'Confirm & Continue'}
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 'kyc' && (
          <Card>
            <CardHeader>
              <CardTitle>KYC Compliance</CardTitle>
              <CardDescription>Final identity check</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <Fingerprint className="size-5 text-amber-600" />
                <div>
                  <p className="text-sm text-amber-900 font-medium">Liveness Check Required</p>
                  <p className="text-xs text-amber-700">We need to verify it's really you, {kycData.firstName}.</p>
                </div>
              </div>
              <Button className="w-full bg-[#008753] hover:bg-[#006d42]" onClick={handleKycComplete} disabled={isVerifying}>
                {isVerifying ? 'Processing...' : 'Start Face Scan'}
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 'complete' && (
          <Card className="text-center">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="inline-flex items-center justify-center size-16 bg-[#008753]/10 rounded-full">
                <CheckCircle2 className="size-8 text-[#008753]" />
              </div>
              <div>
                <h2 className="text-[#008753] text-xl font-bold mb-2">Welcome, {kycData.firstName}!</h2>
                <p className="text-slate-600 text-sm">Your account is ready.</p>
                <Badge variant="secondary" className="mt-3 bg-purple-100 text-purple-700 gap-1">
                  <Sparkles className="size-3" /> 
                  Wallet ID: {Math.floor(1000000000 + Math.random() * 9000000000)}
                </Badge>
              </div>
              <Button className="w-full bg-[#008753] hover:bg-[#006d42]" size="lg" onClick={() => onComplete()}>Go to Dashboard <ArrowRight className="ml-2 size-4" /></Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}