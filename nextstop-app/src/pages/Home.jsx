import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation Header */}
      <nav style={{
        padding: '20px 0',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>⌖</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>NextStop</span>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" style={{ 
              padding: '8px 20px', 
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: '500',
              borderRadius: '6px',
              transition: 'all 0.3s ease'
            }}>
              Login
            </Link>
            <Link to="/signup" style={{ 
              padding: '8px 20px', 
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: '700',
            margin: '0 0 20px 0',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            lineHeight: '1.1'
          }}>
            Smart Bus Tracking
            <br />
            <span style={{ color: '#a7f3d0' }}>Made Simple</span>
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 40px auto'
          }}>
            Track buses in real-time, find optimal routes, and never miss your ride again with our intelligent transportation platform.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{ 
              padding: '15px 30px', 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '1.1rem',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>▶</span> Start Tracking
            </Link>
            <Link to="/driver/signup" style={{ 
              padding: '15px 30px', 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#10b981',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>●</span> Join as Driver
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', background: 'rgba(255, 255, 255, 0.95)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700',
              color: '#333',
              margin: '0 0 20px 0'
            }}>
              Why Choose NextStop?
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Experience the future of public transportation with our cutting-edge features
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '40px',
            marginBottom: '60px'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '20px', 
              padding: '40px',
              color: 'white',
              textAlign: 'center',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px', fontWeight: 'bold' }}>⌖</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 15px 0' }}>Real-time Tracking</h3>
              <p style={{ opacity: 0.9, lineHeight: '1.6' }}>
                Get live bus locations with pinpoint accuracy using our advanced GPS tracking system
              </p>
              <Link to="/signup" style={{ 
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 25px', 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '500',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                Start Tracking →
              </Link>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
              borderRadius: '20px', 
              padding: '40px',
              color: 'white',
              textAlign: 'center',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px', fontWeight: 'bold' }}>●</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 15px 0' }}>Driver Portal</h3>
              <p style={{ opacity: 0.9, lineHeight: '1.6' }}>
                Join our network of professional drivers and manage your routes efficiently
              </p>
              <Link to="/driver/signup" style={{ 
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 25px', 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '500',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                Join Network →
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '30px'
          }}>
            <div style={{ 
              padding: '30px', 
              backgroundColor: 'white', 
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(16,185,129,0.15)',
              textAlign: 'center',
              border: '1px solid rgba(16,185,129,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold', color: '#10b981' }}>◉</div>
              <h4 style={{ color: '#10b981', margin: '0 0 15px 0', fontSize: '1.3rem', fontWeight: '600' }}>Interactive Maps</h4>
              <p style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>
                Navigate with beautiful, responsive maps powered by Leaflet with real-time route visualization
              </p>
            </div>

            <div style={{ 
              padding: '30px', 
              backgroundColor: 'white', 
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(16,185,129,0.15)',
              textAlign: 'center',
              border: '1px solid rgba(16,185,129,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold', color: '#10b981' }}>↻</div>
              <h4 style={{ color: '#10b981', margin: '0 0 15px 0', fontSize: '1.3rem', fontWeight: '600' }}>Live Updates</h4>
              <p style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>
                Receive instant notifications about bus arrivals, delays, and route changes
              </p>
            </div>

            <div style={{ 
              padding: '30px', 
              backgroundColor: 'white', 
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(16,185,129,0.15)',
              textAlign: 'center',
              border: '1px solid rgba(16,185,129,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold', color: '#10b981' }}>◐</div>
              <h4 style={{ color: '#10b981', margin: '0 0 15px 0', fontSize: '1.3rem', fontWeight: '600' }}>Multi-language</h4>
              <p style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>
                Use the app in English or Hindi with our comprehensive internationalization support
              </p>
            </div>

            <div style={{ 
              padding: '30px', 
              backgroundColor: 'white', 
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(16,185,129,0.15)',
              textAlign: 'center',
              border: '1px solid rgba(16,185,129,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold', color: '#10b981' }}>▣</div>
              <h4 style={{ color: '#10b981', margin: '0 0 15px 0', fontSize: '1.3rem', fontWeight: '600' }}>Smart Simulation</h4>
              <p style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>
                Experience realistic bus movement patterns with our advanced simulation engine
              </p>
            </div>

            <div style={{ 
              padding: '30px', 
              backgroundColor: 'white', 
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(16,185,129,0.15)',
              textAlign: 'center',
              border: '1px solid rgba(16,185,129,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold', color: '#10b981' }}>⚡</div>
              <h4 style={{ color: '#10b981', margin: '0 0 15px 0', fontSize: '1.3rem', fontWeight: '600' }}>High Performance</h4>
              <p style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>
                Built with React and optimized for speed with Supabase real-time database
              </p>
            </div>

            <div style={{ 
              padding: '30px', 
              backgroundColor: 'white', 
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(16,185,129,0.15)',
              textAlign: 'center',
              border: '1px solid rgba(16,185,129,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold', color: '#10b981' }}>◈</div>
              <h4 style={{ color: '#10b981', margin: '0 0 15px 0', fontSize: '1.3rem', fontWeight: '600' }}>Secure & Reliable</h4>
              <p style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>
                Your data is protected with enterprise-grade security and 99.9% uptime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '80px 20px', 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            margin: '0 0 20px 0'
          }}>
            Ready to Transform Your Commute?
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            margin: '0 0 40px 0',
            opacity: 0.9
          }}>
            Join thousands of satisfied users who have revolutionized their daily transportation experience
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{ 
              padding: '15px 40px', 
              backgroundColor: 'white',
              color: '#10b981',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>▶</span> Get Started Free
            </Link>
            <Link to="/driver/login" style={{ 
              padding: '15px 40px', 
              backgroundColor: 'transparent',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.1rem',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>●</span> Driver Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '40px 20px', 
        backgroundColor: '#065f46',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '28px', marginRight: '10px', fontWeight: 'bold', color: '#10b981' }}>⌖</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>NextStop</span>
          </div>
          <p style={{ opacity: 0.7, margin: '0 0 20px 0' }}>
            Making public transportation smarter, faster, and more reliable.
          </p>
          <div style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            paddingTop: '20px',
            opacity: 0.6
          }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              © 2025 NextStop. Built with React, Supabase, and ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}