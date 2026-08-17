import api from '../axios';
import useSWR from 'swr';

export interface CertificateVerificationData {
  certificate_number: string;
  student_name: string;
  course_name: string;
  issued_at: string;
  status: string;
  download_url: string;
}

export const PublicCertificateService = {
  /**
   * SWR hook to verify a certificate by its unique number
   */
  useVerifyCertificate(certificateNumber: string | null) {
    const { data, error, isLoading } = useSWR(
      certificateNumber ? `/public/certificates/${certificateNumber}/verify` : null,
      (url) => api.get(url).then((r) => r.data.data),
      {
        shouldRetryOnError: false, // Don't retry if the certificate is not found (404)
      }
    );

    return {
      certificate: (data ?? null) as CertificateVerificationData | null,
      error,
      isLoading,
    };
  },

  /**
   * Triggers a direct download of the certificate PDF using the browser's download functionality
   */
  downloadCertificatePdf(certificateNumber: string) {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api'}/public/certificates/${certificateNumber}/download`;
    // We open it in a new tab to let the browser handle the PDF (view or download) natively for maximum performance.
    window.open(url, '_blank');
  },
};
