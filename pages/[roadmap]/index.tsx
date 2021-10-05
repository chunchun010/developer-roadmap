import { Box, Button, Text, Container, Link, Stack, Badge } from '@chakra-ui/react';
import { ArrowBackIcon, AtSignIcon, DownloadIcon, ViewIcon } from '@chakra-ui/icons';
import { GlobalHeader } from '../../components/global-header';
import { OpensourceBanner } from '../../components/opensource-banner';
import { UpdatesBanner } from '../../components/updates-banner';
import { Footer } from '../../components/footer';
import { PageHeader } from '../../components/page-header';
import { getAllRoadmaps, getRoadmapById, RoadmapType } from '../../lib/roadmap';
import MdRenderer from '../../components/md-renderer';
import Helmet from '../../components/helmet';
import siteConfig from '../../content/site.json';
import React from 'react';
import { event } from '../../lib/gtag';

type RoadmapProps = {
  roadmap: RoadmapType;
};

function ImageRoadmap(props: RoadmapProps) {
  const { roadmap } = props;
  if (!roadmap.imagePath) {
    return null;
  }

  return (
    <Container maxW={'900px'} position='relative'>
      <Box mb='30px'>
        <img alt='Frontend Roadmap' src={roadmap.imagePath} />
      </Box>
    </Container>
  );
}

function TextualRoadmap(props: RoadmapProps) {
  const { roadmap } = props;
  if (!roadmap.contentPath) {
    return null;
  }

  // Remove trailing slashes
  const normalizedPath = roadmap.contentPath.replace(/^\//, '');
  const RoadmapContent = require(`../../content/${normalizedPath}`).default;

  return (
    <Container maxW={'container.md'} position='relative'>
      <MdRenderer>
        <RoadmapContent />
      </MdRenderer>
    </Container>
  );
}

function NewBanner() {
  return (
    <Text _hover={{ textDecoration: 'none', color: 'blue.700', '& .new-badge': { bg: 'blue.700' } }}
          as={Link}
          href={siteConfig.url.youtube}
          d='block'
          target='_blank'
          color='red.700'
          fontSize='sm'
          mb='10px'
          fontWeight={500}
          onClick={() => event({
            category: 'Subscription',
            action: 'Clicked the YouTube banner',
            label: 'YouTube Alert on Roadmap'
          })}>
      <Badge transition={'all 300ms'} className='new-badge' mr='7px' colorScheme='red' variant='solid'>New</Badge>
      <Text textDecoration='underline' as='span' d={['none', 'inline']}>Roadmap topics to be covered on our YouTube
        Channel</Text>
      <Text textDecoration='underline' as='span' d={['inline', 'none']}>Topic videos being made on YouTube</Text>
      <Text as='span' ml='5px'>&raquo;</Text>
    </Text>
  );
}

export default function Roadmap(props: RoadmapProps) {
  const { roadmap } = props;

  return (
    <Box bg='white' minH='100vh'>
      <GlobalHeader />
      <Helmet
        title={roadmap?.seo?.title || roadmap.title}
        description={roadmap?.seo?.description || roadmap.description}
        keywords={roadmap?.seo.keywords || []}
      />
      <Box mb='60px'>
        <PageHeader
          beforeTitle={<NewBanner />}
          title={roadmap.title}
          subtitle={roadmap.description}
        >
          <Stack mt='20px' isInline>
            <Button d={['flex', 'flex']} as={Link} href={'/roadmaps'} size='xs' py='14px' px='10px'
                    colorScheme='teal' variant='solid' _hover={{ textDecoration: 'none' }}>
              &larr; <Text as='span' d={['none', 'inline']} ml='5px'>All Roadmaps</Text>
            </Button>

            {roadmap.pdfUrl && (
              <Button as={Link}
                      href={roadmap.pdfUrl}
                      target='_blank'
                      size='xs'
                      py='14px'
                      px='10px'
                      leftIcon={<DownloadIcon />}
                      colorScheme='yellow'
                      variant='solid'
                      _hover={{ textDecoration: 'none' }}>
                Download
              </Button>
            )}
            <Button as={Link} href={'/signup'} size='xs' py='14px' px='10px' leftIcon={<AtSignIcon />}
                    colorScheme='yellow' variant='solid' _hover={{ textDecoration: 'none' }}>
              Subscribe
            </Button>
          </Stack>
        </PageHeader>

        <ImageRoadmap roadmap={roadmap} />
        <TextualRoadmap roadmap={roadmap} />
      </Box>

      <OpensourceBanner />
      <UpdatesBanner />
      <Footer />
    </Box>
  );
}

type StaticPathItem = {
  params: {
    roadmap: string
  }
};

export async function getStaticPaths() {
  const roadmaps = getAllRoadmaps();
  const paramsList: StaticPathItem[] = roadmaps.map(roadmap => ({
    params: { 'roadmap': roadmap.id }
  }));

  return {
    paths: paramsList,
    fallback: false
  };
}

type ContextType = {
  params: {
    roadmap: string
  }
};

export async function getStaticProps(context: ContextType) {
  const roadmapId: string = context?.params?.roadmap;

  return {
    props: {
      roadmap: getRoadmapById(roadmapId)
    }
  };
}