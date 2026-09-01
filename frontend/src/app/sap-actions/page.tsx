'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle2, Server, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function PageContent() {
  const searchParams = useSearchParams();
  const sim = searchParams.get('sim');

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Action Executed Successfully</h1>
        <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto">
          The recovery action has been approved and submitted to the SAP ERP system. Purchase orders are being updated automatically.
        </p>
        
        <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-md font-mono text-sm mb-12">
          <Server className="w-4 h-4" />
          <span>BAPI_PO_CHANGE_SUCCESS</span>
        </div>
        
        <div>
          <Link 
            href="/command-center"
            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800"
          >
            Return to Command Center <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}


export default function Page() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
