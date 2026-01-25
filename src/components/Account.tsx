"use client";
import React, { useState } from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { Card, CardContent, Badge, Button, Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/primitives'; // Ensure path is correct based on your folder structure
import { useUserRole } from '../contexts/UserRoleContext';
import { useAuth } from '../contexts/AuthContext'; 

export function Account() {
  const { role, roleConfig, setRole, availableRoles } = useUserRole();
  const { logout, user } = useAuth(); 
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-[#008753] rounded-full mx-auto mb-3 flex items-center justify-center text-white">
          <User size={40} />
        </div>
        
        <h2 className="font-bold text-lg">
          {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
        </h2>
        <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
        <Badge variant="outline" className="border-[#008753] text-[#008753]">{roleConfig.name}</Badge>
      </div>

      <Card>
        <CardContent className="p-0 divide-y">
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm font-medium">Account Role</span>
            <Button variant="outline" size="sm" onClick={() => setShowRoleSelector(true)}>Switch</Button>
          </div>
          <div className="p-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
               <ShieldCheck size={18} className="text-gray-400"/>
               <span className="text-sm">KYC Status</span>
             </div>
             <Badge>Verified</Badge>
          </div>
        </CardContent>
      </Card>
      
      
      <Button 
        variant="outline" 
        className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200" 
        onClick={logout}
      >
        Log Out
      </Button>

      <Dialog open={showRoleSelector} onOpenChange={setShowRoleSelector}>
        <DialogContent>
          <DialogHeader><DialogTitle>Switch Role (Demo)</DialogTitle></DialogHeader>
          <div className="space-y-2 py-4">
            {availableRoles.map((r: string) => (
              <button 
                key={r}
                onClick={() => { setRole(r); setShowRoleSelector(false); }}
                className={`w-full p-3 text-left rounded-lg text-sm ${role === r ? 'bg-[#008753]/10 text-[#008753] font-bold' : 'hover:bg-gray-50'}`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
          <Button variant="outline" onClick={() => setShowRoleSelector(false)}>Cancel</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}